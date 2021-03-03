# Upwork Invoices Reader

<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>

Prints the total amount received and the total fees collected by multiple Upwork invoices.

Output Example
```
T3496782390.pdf (May 1, 2020) Received: $227.50
T3496782401.pdf (May 1, 2020) Upwork Fees: $10.00
T3506782104.pdf (May 4, 2020) Received: $322.50
T3506782112.pdf (May 4, 2020) Upwork Fees: $30.59
T3526781351.pdf (May 15, 2020) Received: $480.00
T3526781356.pdf (May 15, 2020) Upwork Fees: $40.27
T3536788461.pdf (May 25, 2020) Received: $540.83
T3536788470.pdf (May 25, 2020) Upwork Fees: $35.56

Summary (statements_2020_05)
TOTAL AMOUNT: $1570.83
SERVICE FEE + VAT: $116.42
```

**Note:** Each invoice may take more than 10 seconds to be analyzed. The invoice PDF is being converted to JPG and, then interpreted by Tesseract.

## Dependencies

* [tesseract.js](https://github.com/naptha/tesseract.js)
* [node-imagemagick](https://github.com/rsms/node-imagemagick)

## Requirements

Install and set binary paths in your shell.

* [ImageMagick](https://imagemagick.org/)

## Install

```
$ npm install
```

## Usage

Copy your invoices to `files/<invoices_dir_name>`.

Create a `.env` file and set the directory invoices name you want get information.
```
INVOICES_DIR=<invoices_dir_name>
```

Run program.
```
npm start
```
