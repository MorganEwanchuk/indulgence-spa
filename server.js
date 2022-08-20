const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/new-contact.html');
});


app.post('/myForm', (req, res) => {
    const { consentHeader,consentName, secondConsentName, techniquesHeader, techniquesParagraph, listItem1, listItem2, listItem3, listItem4, listItem5, listItem6, regionsParagraph, regionsListItem1, regionsListItem2, consentSignature, consentDate,intakeHeader, intakeIndulgenceAddress, intakeIndulgencePostal, intakeName, intakeAddress, intakePostal,intakeBirthdate, intakeEmail, maleGenderCheckbox, femaleGenderCheckbox} = req.body

    const techniquesItems = [listItem1,listItem2,listItem3,listItem4,listItem5,listItem6];




    const regionsItems = [regionsListItem1, regionsListItem2]


    // Creation of consent document
    const consentDoc = new PDFDocument();
    consentDoc.pipe(fs.createWriteStream('consentForm.pdf'))


    // Header input
    consentDoc.fontSize(20).text(consentHeader, {marginBottom: 7}).moveDown();
    // doc.fontSize(14).text(paragraph1);
    // doc.fontSize(14).text(paragraph2);
    
    // Techniques/Draping with list

    consentDoc.fontSize(16).text(techniquesHeader, {marginBottom: 7}).moveDown();
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

    // const { consentHeader,consentName, secondConsentName, techniquesHeader, techniquesParagraph, listItem1, listItem2, listItem3, listItem4, listItem5, listItem6, regionsParagraph, regionsListItem1, regionsListItem2, consentSignature, consentDate,intakeHeader, intakeIndulgenceAddress, intakeIndulgencePostal, intakeName, intakeAddress, intakePostal,intakeBirthdate} = req.body

    
    
    // Creation of intake doc
    const intakeDoc = new PDFDocument();
    intakeDoc.pipe(fs.createWriteStream('intakeForm.pdf'))

    // Intake Header Info
    intakeDoc.fontSize(20).text(intakeHeader).moveDown();
    intakeDoc.fontSize(10).text(`${intakeIndulgenceAddress} ${intakeIndulgencePostal}`,{marginBottom: 7}).moveDown();
    
    // intakeDoc.fontSize(14).text(intakeIndulgencePostal, {marginBottom: 7}).moveDown();
    

    // Intake Contact Info 
    intakeDoc.fontSize(14).text(`Name: ${intakeName}`, {marginBottom: 7}).moveDown();
    intakeDoc.fontSize(14).text(`Address: ${intakeAddress}`, {marginBottom: 7}).moveDown();
    intakeDoc.fontSize(14).text(`Postal Code: ${intakePostal}`, {marginBottom: 7}).moveDown();
    intakeDoc.fontSize(14).text(`Birth Date: ${intakeBirthdate}`, {marginBottom: 7}).moveDown();

    intakeDoc.fontSize(14).text(`Email: ${intakeEmail}`, {marginBottom: 7}).moveDown();
    const emailY = intakeDoc.y

    // const checkboxOptions = [  { label: 'Male', x: 28.5, y: intakeDoc.y + -155, checked: true },  { label: 'Female', x: 57, y: intakeDoc.y - 155,checked: true},{ label: 'poopscooper', x: 114, y: intakeDoc.y - 155,checked: true}] 

    const maleOptionCheck = req.body.Male === 'checked';
    const femaleOptionCheck = req.body.Female === 'checked';

    const checkboxes = [maleOptionCheck, femaleOptionCheck] 
    
    const checkboxOptions = [{ label: 'Male', x: 28.5, y: intakeDoc.y + -155, checked: maleOptionCheck },  { label: 'Female', x: 57, y: intakeDoc.y - 155,checked: femaleOptionCheck}]

    // for(let i = 0; i < checkboxes.length; i++){
    //   // const checkbox = checkboxes[i]
    //   console.log(checkboxes[i])
    //   }
    
    
    
    let checkboxY = emailY + 15
    checkboxOptions.forEach((option) => {
        // Draw the checkbox square
        console.log(checkboxOptions)
        intakeDoc.translate(option.x,option.y)
        intakeDoc.translate(option.x,option.y)

        let labelWidth = intakeDoc.widthOfString(option.label)

        intakeDoc.rect(option.x + labelWidth + 15, option.y + 2, 10, 10).stroke();


           if (option.checked) {
            intakeDoc.lineWidth(1)
            //    .moveTo(option.x + 2, option.y + 2)
            //    .lineTo(option.x + 8, option.y + 8)
            //    .moveTo(option.x + 47, option.y + 4)
            //    .lineTo(option.x + 53, option.y + 10)
               .moveTo(option.x + labelWidth + 17, option.y + 4)
               .lineTo(option.x + labelWidth + 23, option.y + 10)
               .stroke();
        
               intakeDoc.lineWidth(1)
            //    .moveTo(option.x + 2, option.y + 8)
            //    .lineTo(option.x + 8, option.y + 2)
            //    .moveTo(option.x + 53, option.y + 4)
            //    .lineTo(option.x + 47, option.y + 10)
               .moveTo(option.x + labelWidth + 23, option.y + 4)
               .lineTo(option.x + labelWidth + 17, option.y + 10)
               .stroke();
          }

          intakeDoc.fontSize(12)
     .text(option.label, option.x + 15, option.y + 2);

     intakeDoc.translate(-option.x,-option.y)

     checkboxY += 15

    });

    intakeDoc.y = checkboxY

    intakeDoc.end()

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
        },{
            filename: 'intakeForm.pdf',
            path: 'intakeForm.pdf',
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