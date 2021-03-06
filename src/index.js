const { readInvoicesDirectory } = require('./read-invoices-directory')

const main = async () => {
  if (process.argv.length < 3) {
    console.log('usage:')
    console.log('npm start -- <dir_name> <dir_name1>')
    console.log('')
    process.exit(1)
  }

  const invoicesDirs = process.argv.slice(2)
  for (let i = 0; i < invoicesDirs.length; i++) {
    await readInvoicesDirectory(invoicesDirs[i])
  }
}

main()
