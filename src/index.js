const Tesseract = require('tesseract.js')
const im = require('imagemagick')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

let SkipConversion = false
const LogTesseract = false
const invoicesDirName = process.env.INVOICES_DIR
const tmpDir = path.join(__dirname, '..', 'tmp')

const invoicesDirPath = path.join(__dirname, '..', 'files', invoicesDirName)
const tmpInvoicesDirPath = path.join(tmpDir, invoicesDirName);

(async function () {
  const invoices = fs.readdirSync(invoicesDirPath)

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir)
  }

  if (!fs.existsSync(tmpInvoicesDirPath)) {
    fs.mkdirSync(tmpInvoicesDirPath)
  } else {
    SkipConversion = true
  }

  let total = 0
  let fee = 0

  for (let i = 0; i < invoices.length; i++) {
    const invoiceName = invoices[i]
    const invoice = await readInvoice(invoiceName)
    if (invoice.feeInvoice) {
      fee += invoice.totalAmount
    } else {
      total += invoice.totalAmount
    }
    console.log(`${invoiceName}(${invoice.date}) ${invoice.feeInvoice ? 'Upwork Fees' : 'Received'}: $${invoice.totalAmount.toFixed(2)} `)
  }

  console.log(`
Summary (${invoicesDirName})
TOTAL AMOUNT: $${total}
SERVICE FEE + VAT: $${fee}
  `)
})()

async function readInvoice(invoice) {
  const invoicePath = path.join(invoicesDirPath, invoice)
  const invoiceImgPath = path.join(tmpInvoicesDirPath, invoice.replace('.pdf', '.jpg'))

  try {
    if (!SkipConversion) {
      await convertPDFToJPG(invoicePath, invoiceImgPath)
    }
    const pdfContent = await readImageText(invoiceImgPath)

    if (LogTesseract) {
      console.log(`
        ==${invoicePath}==

        ${pdfContent}
      `)
    }

    return extractUpworkInvoiceData(pdfContent)
  } catch (err) {
    console.log(`failed converting pdf ${invoicePath}:`, err)
  }
}

function convertPDFToJPG(srcPath, dstPath) {
  return new Promise((resolve, reject) => {
    const args = ['-density', '150', '-quality', '85']
    im.convert([...args, srcPath, dstPath], (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

function readImageText(imgPath) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imgPath,
      'eng',
      {
        logger: LogTesseract
          ? m => {
            console.log(m)
          }
          : () => {

          }
      }
    ).then(({ data: { text } }) => {
      resolve(text)
    }).catch(err => {
      reject(err)
    })
  })
}

function extractUpworkInvoiceData(text) {
  const amountRegex = /TOTAL AMOUNT:? \$(.*)/
  const totalAmountMatch = amountRegex.exec(text)

  if (!totalAmountMatch) {
    throw new Error('Could not find TOTAL AMOUNT')
  }

  const dateRegex = /DUE DATE (.*)/
  const date = dateRegex.exec(text)

  if (!date) {
    throw new Error('Could not find DUE DATE')
  }

  return {
    totalAmount: +totalAmountMatch[1].replace(',', ''),
    feeInvoice: text.indexOf('Service Fee') >= 0,
    date: date[1]
  }
}
