let puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

export default async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: 'new',
    });
    const page = await browser.newPage();

    await page.goto(
      `${req.query.site}` //?timestamp=${req.query.timestamp}&patientId=${req.query.patientId}&doctorName=${req.query.doctorName}&firstChart=${req.query.firstChart}&secondChart=${req.query.secondChart}
    );
    // await page.waitForSelector(`#${req.query.firstChart}`);
    // await page.waitForSelector(`#${req.query.secondChart}`);

    const pdfFIle = await page.pdf({
      margin: {left: 120},
      format: "A4",
      scale: 0.72254,
    });

    setTimeout(async () => {
      
      await browser.close();
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=generated-pdf.pdf"
      );
      res.status(200);
      res.send(pdfFIle);
    }, 5000);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
