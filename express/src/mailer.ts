import nodemailer from 'nodemailer';


export class Mailer {
  transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });

  }

  async sendMail(from: string, reason: string, description: string) {
    const email = {
      from: 'Api',
      to: process.env.EMAIL,
      cc: [from],
      subject: 'Contact mail: ' + reason,
      html: `
                <b>From</b>: ${from}<br/>
                <b>Reason</b>: ${reason}<br/>
                <b>Description</b>: ${description}<br/>
            `,
    };
    return await this.transporter.sendMail(email);


  }

}
