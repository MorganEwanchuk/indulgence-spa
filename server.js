const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/myForm', (req, res) => {
    const { header,consentName, secondConsentName, paragraph1, paragraph2, header3} = req.body

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'))

    doc.fontSize(20).text(header);
    doc.fontSize(14).text(paragraph1);
    doc.fontSize(14).text(paragraph2);
    doc.fontSize(16).text(header3);
    doc.fontSize(12).text(`Name: ${consentName}`);
    doc.fontSize(12).text(`Second Name: ${secondConsentName}`);

    doc.end()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'morganlieu@gmail.com',
          pass: 'dexppxlrqbomyhdh'
        }
      });

      const mailOptions = {
        from: 'morganlieu@gmail.com',
        to: 'mewanchuk@live.com',
        subject: 'New form submission',
        attachments: [{
            filename: 'output.pdf',
            path: 'output.pdf',
            contentType: 'application/pdf',
            encoding: 'utf8'
        }]
      };



    //   const mailOptions = {
    //     from: 'morganlieu@gmail.com',
    //     to: 'mewanchuk@live.com',
    //     subject: 'New form submission',
    //     html: `
            
    //       <h1>${header}</h1>
    //       <p>${paragraph1}</p>
    //       <p>${paragraph2}</p>
    //       <h3>${header3}</h3>
    //       <p>Name: ${consentName}</p>
    //       <p>Second Name: ${secondConsentName}</p>
    //     `
    //   };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);
          res.send('Form submitted successfully');
        }
      });
    });
    

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});