const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/new-contact.html');
});


app.post('/myForm', (req, res) => {
    const { header,consentName, secondConsentName, header3, techniquesParagraph, listItem1, listItem2, listItem3, listItem4, listItem5, listItem6, regionsParagraph, regionsListItem1, regionsListItem2, consentSignature, consentDate} = req.body

    const techniquesItems = [listItem1,listItem2,listItem3,listItem4,listItem5,listItem6];

    const regionsItems = [regionsListItem1, regionsListItem2]


    // Creation of consent document
    const consentDoc = new PDFDocument();
    consentDoc.pipe(fs.createWriteStream('consentForm.pdf'))


    // Header input
    consentDoc.fontSize(20).text(header, {marginBottom: 7}).moveDown();
    // doc.fontSize(14).text(paragraph1);
    // doc.fontSize(14).text(paragraph2);
    
    // Techniques/Draping with list

    consentDoc.fontSize(16).text(header3, {marginBottom: 7}).moveDown();
    consentDoc.fontSize(14).text(techniquesParagraph, {marginBottom: 7}).moveDown();
    consentDoc.list(techniquesItems, {marginBottom: 7}).moveDown();

    // Regions with list
    consentDoc.fontSize(14).text(regionsParagraph, {marginBottom: 7}).moveDown();
    consentDoc.list(regionsItems, {marginBottom: 7}).moveDown();





    // Consent name inputs
    consentDoc.fontSize(12).text(`I, ${consentName}, have read and understand the above information and give my consent to the registered massage therapist of Indulgence Therapeutic Massage to treat me with the understanding that the above regions indicated above may be touched for therapeutic purposes.`, {marginBottom: 7}).moveDown();
    consentDoc.fontSize(12).text(`I, ${secondConsentName}, understand that at any point of the massage session, I can request my therapist to adjust/change the pressure and techniques used.`, {marginBottom: 7}).moveDown() 

    // Consent signature and date
    consentDoc.fontSize(12).text(`SIGNATURE: ${consentSignature}`, {marginBottom: 5}).moveDown()
    consentDoc.fontSize(12).text(`DATE: ${consentDate}`)

    // End of consent PDF

    consentDoc.end()





    // Email sender information
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'morganlieu@gmail.com',
          pass: 'dexppxlrqbomyhdh'
        }
      });


      // Attachments and file names 
      const mailOptions = {
        from: 'morganlieu@gmail.com',
        to: 'mewanchuk@live.com',
        subject: `Consent form for ${consentName}`,
        attachments: [{
            filename: 'consentForm.pdf',
            path: 'consentForm.pdf',
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

    // Sends the mail
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