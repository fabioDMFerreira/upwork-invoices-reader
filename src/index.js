const Tesseract = require('tesseract.js');
const im = require('imagemagick');
const fs = require('fs');
const path = require('path');

let SkipConversion = false;
const LogTesseract = false;
const invoicesDirName = "statements_2021-02-February";

const invoicesDirPath = path.join(__dirname, "..", "files", invoicesDirName);
const tmpInvoicesDirPath = path.join(__dirname, "..", "tmp", invoicesDirName);

(async function () {
  const invoices = fs.readdirSync(invoicesDirPath);

  if (!fs.existsSync(tmpInvoicesDirPath)) {
    fs.mkdirSync(tmpInvoicesDirPath);
  } else {
    SkipConversion = true;
  }

  let total = 0;
  let fee = 0;

  for (let i = 0; i < invoices.length; i++) {
    const invoice = await readInvoice(invoices[i])
    if (invoice.feeInvoice) {
      fee += invoice.totalAmount;
    } else {
      total += invoice.totalAmount;
    }
    console.log({
      total, fee
    });
  }

})()

async function readInvoice(invoice) {
  const invoicePath = path.join(invoicesDirPath, invoice);
  const invoiceImgPath = path.join(tmpInvoicesDirPath, invoice.replace(".pdf", ".jpg"));

  try {
    if (!SkipConversion) {
      await convertPDFToJPG(invoicePath, invoiceImgPath);
    }
    const pdfContent = await readImageText(invoiceImgPath);
    console.log(`
      ==${invoicePath}==

      ${pdfContent}
    `)
    return extractInvoiceData(pdfContent);
  } catch (err) {
    console.log(`failed converting pdf ${invoicePath}:`, err);
  }
}

function extractInvoiceData(text) {
  const amountRegex = /TOTAL AMOUNT:? \$(.*)/
  const totalAmountMatch = amountRegex.exec(text);

  if (!totalAmountMatch) {
    throw new Error("Could not find TOTAL AMOUNT");
  }

  return {
    totalAmount: +totalAmountMatch[1].replace(",", ""),
    feeInvoice: text.indexOf("Service Fee") >= 0
  }
}

function convertPDFToJPG(srcPath, dstPath) {
  return new Promise((accept, reject) => {
    const args = ["-density", "150", "-quality", "85"];
    im.convert([...args, srcPath, dstPath], (err) => {
      if (err) {
        return reject(err)
      }

      accept()
    })
  });
}


function readImageText(imgPath) {
  return new Promise((accept, reject) => {
    Tesseract.recognize(
      imgPath,
      'eng',
      {
        logger: LogTesseract ? m => {
          console.log(m)
        } : () => { }
      }
    ).then(({ data: { text } }) => {
      accept(text)
    }).catch(err => {
      reject(err);
    });
  })
}
