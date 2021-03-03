# Upwork Invoices

<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>

Reads multiple invoices files and prints the total amount received and the total fees collected by Upwork.


## Requirements

* [Tesseract](https://tesseract-ocr.github.io/tessdoc/Downloads) (not required but make images interpretation much faster)
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
