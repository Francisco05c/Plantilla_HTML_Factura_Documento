const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

export default async function handler(request, response) {
  const protocol = request.headers['x-forwarded-proto'] || 'http';
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  
  const queryParams = new URLSearchParams(request.query);
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
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

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
    const errorDetails = error instanceof Error ? error.toString() : JSON.stringify(error);
    return response.status(500).send({ error: 'No se pudo generar el PDF.', details: errorDetails });

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}