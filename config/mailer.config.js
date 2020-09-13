
require('dotenv').config()
const { getMaxListeners } = require("process");
const nodemailer = require('nodemailer');
const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER;

const transport = nodemailer.createTransport(
	{
		service: 'Gmail',
		auth: {
			user: user,
			pass: process.env.NM_PASS
		}
	}
)

module.exports.sendValidationEmail = ({ name, email, id, activationToken }) => {
	transport.sendMail({
		to: email,
		from: `AdoptMe Team <${user}>`,
		subject: 'Please, activate your account!',
		html: `
			<table cellpadding="60" cellspacing="0" border="0" width="100%">
				<tr bgcolor="#1C9569">
					<td align="center">
					<p style="padding-bottom:60px">🐶</p>
					<table cellpadding="60" cellspacing="0" border="0" width="50%" align="center">
						<tr bgcolor="#fff">
						<td align="center">
						<img src="/images/dark-logo-lyr.png" width="200">
						<h1>AdoptMe confirmation Email</h1>
						<h4>Hello ${name}!</h4>
						<p>Thanks to join our community! Please confirm your account by clicking on the following link:</p>
						<a href="${host}/users/${id}/activate/${activationToken}" style="padding: 10px 20px; color: white; background-color: green; border-radius: 5px;">Click here</a>
						<h4>Goog luck finding your future pet and thank you for trusting in us!</h4>
						</td>
						</tr>
					</table>
					<img src="/images/dark-logo.png" width="200">
					<p style="padding-top:60px">You are doing awesome!</p>
					</td>
				</tr>
			</table>
		`
	})
		.then(console.log)
		.catch(console.error)
}

// <h1>Hi ${name}</h1>
{/* <p>Click on the button below to activate your AdoptMe account!</p> */}
{/* <a href="${host}/users/${id}/activate/${activationToken}" style="padding: 10px 20px; color: white; background-color: green; border-radius: 5px;">Click here</a> */}
