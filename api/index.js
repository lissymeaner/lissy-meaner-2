// Define all needed modules
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Assign port constant
const port = process.env.PORT || 3000;

// Fetch credentials.env, though it needs to be locked
require('dotenv').config({ path: path.join(__dirname, '..', 'credentials.env') });

// If the app can't find my email address or password from the file,
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  // // Return an error message to the console to say it has not been set,
  // // therefore any email a user sends will not go through.
  console.warn('EMAIL_USER or EMAIL_PASS not set. Email sending from the user will fail.')
}

// Assign variable for project file path
const projectsfilePath = path.join(__dirname, '..', 'public', 'js', 'data', 'projects.json');

// Import all modules needed first thing onto the app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse form submissions
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve your HTML, CSS, and JS from a 'public' folder


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// // GET projects.html page
// app.get("/projects", (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'projects.html'));
// });

// // GET about.html page
// app.get("/about", (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
// });

// // GET contact.html page
// app.get("/contact", (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
// });

// Logic for when the user makes a GET request to api/projects
// // by getting the appropriate JSON data back for the page.
app.get("/api/projects", (req, res) => {
  // // Read the projects file.
  fs.readFile(projectsfilePath, 'utf8', (err, data) => {
    // // Convert JSON string of projects into objects.
    const projects = JSON.parse(data);
    // // If the request is successful, send the JSON response.
    res.status(200).json(projects);
  });
});

// Logic for when the user makes a POST request to api/contact
// // by submitting their email via public/contact.html
app.post('/api/contact', async (req, res) => {
  // // Assign the body as an object
  const { firstName, lastName, email, subject, message } = req.body;

  // // Log incoming request for debugging
  console.log("Contact form submission:", req.body);

  // // Minimal validation
  if (!email || !message) return res.status(400).json({ error: 'Email address and body is required.' });

  // // Make transporter using Gmail + app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = { // // properties of the sent email from the recipient's side
    from: process.env.EMAIL_USER, // // keep from as the authenticated account
    to: process.env.EMAIL_USER, // // send to your own address
    replyTo: `${firstName || ''} ${lastName || ''} <${email}>`, // // allows the recipient user to reply back to the sender
    subject: `Contact form: ${subject || '(no subject)'}`,
    html: `
        <p><strong>From: </strong> ${firstName || ''} ${lastName || ''} &lt;${email}&gt;</p>
        <p><strong>Subject: </strong> ${subject || ''}</p>
        <hr />
        <p>${(message || '').replace(/\n/g, '<br/>')}</p>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);
    return res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).send('Failed to send email.');
  };

});

// Start the server and listen to incoming requests from localhost port 3000.
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});