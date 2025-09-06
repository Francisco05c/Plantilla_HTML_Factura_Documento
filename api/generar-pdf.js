const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

export default async function handler(request, response) {
  const protocol = request.headers['x-forwarded-proto'] || 'http';
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const queryParams = new URLSearchParams(request.query).toString();
  const targetUrl = `${protocol}://${host}/?${queryParams}`;
  console.log(`Puppeteer visitará la URL: ${targetUrl}`);

  // --- INICIO MODIFICACIÓN: Lógica para el nombre del archivo ---

  // NUEVO: Leemos el parámetro 'nombreArchivo' de la URL.
  const nombreArchivoParam = request.query.nombreArchivo;
  
  // NUEVO: Establecemos un nombre por defecto.
  let nombreFinal = 'factura.pdf';

  // NUEVO: Si el parámetro existe y no está vacío...
  if (nombreArchivoParam && nombreArchivoParam.trim() !== '') {
    // 1. Limpiamos (sanitizamos) el nombre para evitar caracteres inválidos.
    //    Permitimos letras, números, guiones, guiones bajos y puntos.
    let nombreLimpio = nombreArchivoParam.replace(/[^a-zA-Z0-9-_\.]/g, '');
    
    // 2. Nos aseguramos de que el nombre termine en .pdf
    if (!nombreLimpio.toLowerCase().endsWith('.pdf')) {
      nombreLimpio += '.pdf';
    }
    
    nombreFinal = nombreLimpio;
  }
  console.log(`El nombre del archivo PDF será: ${nombreFinal}`); // Log para depuración

  // --- FIN MODIFICACIÓN ---

  let browser = null;

  try {
    const executablePath = await chrome.executablePath;
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    response.setHeader('Content-Type', 'application/pdf');
    // NUEVO: Usamos la variable 'nombreFinal' para establecer el nombre del archivo dinámicamente.
    response.setHeader('Content-Disposition', `inline; filename="${nombreFinal}"`);
    
    return response.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return response.status(500).send({ error: 'No se pudo generar el PDF.', details: error.message });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}