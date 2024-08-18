exports.forgotPasswordTemplate = (otp) => {
    return (`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 100px;
        }
        .content {
            text-align: center;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777777;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password. Use the OTP below to proceed with resetting your password:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Amazon. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`);
};
