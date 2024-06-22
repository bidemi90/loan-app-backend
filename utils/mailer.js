const nodemailer = require("nodemailer");

const sendMail = async (email, name, type) => {
    let subject, contactTemplate;

    if (type === "welcome") {
        subject = "Welcome to the Joy Loan";
        contactTemplate = `
        <div>
            <div>
                <h2 style="color:#2036ea;">Welcome to the Joy Loan</h2>
            </div>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <h2 style="color:#2036ea;">Message:</h2>
                <p>
                    Dear ${name},<br><br>
                    Welcome to the Joy Loan! We're thrilled to have you with us. With our app, you can easily apply for and manage your loans. Start by exploring our loan options and choose the one that best suits your needs. Whether you're looking for a personal loan, a business loan, or any other type of financial assistance, we're here to help you every step of the way. If you have any questions or need support, please don't hesitate to reach out to our customer service team. We wish you success in achieving your financial goals!
                    <br><br>
                    Best regards,<br>
                    The Joy Loan Team
                </p>
            </div>
            <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
        </div>`;
    } 
    else if (type === "outstandingLoan") {
        subject = "Outstanding Loan Notification";
        contactTemplate = `
        <div>
            <div>
                <h2 style="color:#2036ea;">Outstanding Loan Notification</h2>
            </div>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <h2 style="color:#2036ea;">Message:</h2>
                <p>
                    Dear ${name},<br><br>
                    We hope this message finds you well. We are writing to remind you that you have an outstanding loan with us. We kindly request that you make the necessary arrangements to settle your loan at your earliest convenience. If you have any questions or need assistance, please do not hesitate to contact our support team. We are here to help you.
                    <br><br>
                    Best regards,<br>
                    The Joy Loan Team
                </p>
            </div>
            <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
        </div>`;
    } 
    else if (type === "welcomeAdmin") {
        subject = "Welcome to the Joy Loan Admin Team!";
        contactTemplate = `
        <div>
            <div>
                <h2 style="color:#2036ea;">Welcome to the Joy Loan Admin Team!</h2>
            </div>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <h2 style="color:#2036ea;">Message:</h2>
                <p>
                    Dear ${name},<br><br>
                    We are excited to welcome you to the Joy Loan Admin Team! Your expertise and dedication will be invaluable as we work together to provide excellent service to our users. You now have access to the admin portal where you can manage loans, review applications, and assist our users effectively.
                    <br><br>
                    If you have any questions or need assistance, please feel free to reach out to our support team. We are here to help you.
                    <br><br>
                    Best regards,<br>
                    The Joy Loan Team
                </p>
            </div>
            <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
        </div>`;
    }
    
    else if (type === "legalAction") {
        subject = "Important: Potential Legal Action";
        contactTemplate = `
        <div>
            <div>
                <h2 style="color:#2036ea;">Important: Potential Legal Action</h2>
            </div>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <h2 style="color:#2036ea;">Message:</h2>
                <p>
                    Dear ${name},<br><br>
                    This is a reminder regarding your outstanding loan. We understand that circumstances may arise that make repayment difficult, and we want to work with you to find a solution. However, if we do not receive your payment or hear from you within the next [specified time frame], we may have to take legal action to recover the outstanding amount.
                    <br><br>
                    We strongly encourage you to contact us as soon as possible to discuss your situation and explore potential repayment options.
                    <br><br>
                    Best regards,<br>
                    The Joy Loan Team
                </p>
            </div>
            <p style="color:#2036ea;"><i>The Joy Loan Team.</i></p>
        </div>`;
    } 
    else {
        throw new Error("Invalid email type");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: subject,
        text: "Notification from Joy Loan",
        html: contactTemplate,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendMail };








// const { sendMail } = require('./path/to/mailer');

// // Send welcome email
// sendMail('user@example.com', 'John Doe', 'welcome');

// // Send outstanding loan notification email
// sendMail('user@example.com', 'John Doe', 'outstandingLoan');

// // Send legal action warning email
// sendMail('user@example.com', 'John Doe', 'legalAction');
