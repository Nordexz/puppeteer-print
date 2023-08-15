const express = require('express')
let puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

const app = express()
const port = process.env.PORT || 5001

app.get('/print', async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--disable-extensions', '--no-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: 'new',
    });

    console.log(req.query)

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
})

app.listen(port, '0.0.0.0', () => {
  console.log(`server startedd on port ${port}`)
})