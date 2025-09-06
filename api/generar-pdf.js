// Importamos las nuevas librerías.
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

export default async function handler(request, response) {
  // La lógica para construir la URL y el nombre del archivo no cambia.
  const protocol = request.headers['x-forwarded-proto'] || 'http';
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  
  // Clonamos los parámetros para poder modificarlos.
  const queryParams = new URLSearchParams(request.query);
  
  // Eliminamos el parámetro 'nombreArchivo' de la URL que visitará Puppeteer, por si acaso.
  queryParams.delete('nombreArchivo');
  
  const targetUrl = `${protocol}://${host}/?${queryParams.toString()}`;
  console.log(`Puppeteer visitará la URL: ${targetUrl}`);

  const nombreArchivoParam = request.query.nombreArchivo;
  let nombreFinal = 'factura.pdf';
  if (nombreArchivoParam && nombreArchivoParam.trim() !== '') {
    let nombreLimpio = nombreArchivoParam.replace(/[^a-zA-Z0-9-_\.]/g, '');
    if (!nombreLimpio.toLowerCase().endsWith('.pdf')) {
      nombreLimpio += '.pdf';
    }
    nombreFinal = nombreLimpio;
  }
  console.log(`El nombre del archivo PDF será: ${nombreFinal}`);

  let browser = null;

  try {
    // --- ESTA ES LA PARTE QUE CAMBIA ---
    // Lanzamos Puppeteer usando la configuración de la nueva librería '@sparticuz/chromium'
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // La nueva forma de obtener la ruta
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    // --- FIN DE LA PARTE QUE CAMBIA ---

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `inline; filename="${nombreFinal}"`);
    
    return response.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    // Añadimos más detalles al error para tener más pistas si vuelve a fallar.
    const errorDetails = error instanceof Error ? error.toString() : JSON.stringify(error);
    return response.status(500).send({ error: 'No se pudo generar el PDF.', details: errorDetails });

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}