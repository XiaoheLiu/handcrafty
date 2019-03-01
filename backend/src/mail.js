const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

const makeEmail = (name, text) => `
  <div className="email" style="
    border: 1px solid #00ABA9;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
  <h2>Hello, ${name},</h2>
  <p>${text}</p>
  <p>Cheers, Athena from Handcrafty</p>
  </div>
`;

exports.transport = transport;
exports.makeEmail = makeEmail;
