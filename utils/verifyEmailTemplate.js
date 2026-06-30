export const verifyEmailTemplate= (email,otp)=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insta_CloneF · OTP Email</title>
  <!-- inline style + embedded CSS for email clients -->
  <style>
    /* reset & base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #f4f7fc;
      font-family: 'Segoe UI', Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .email-wrapper {
      max-width: 560px;
      width: 100%;
      background: #ffffff;
      border-radius: 28px;
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(2px);
      transition: 0.2s;
    }
    .email-header {
      background: linear-gradient(145deg, #1e2b3c, #0f1a26);
      padding: 28px 32px 20px 32px;
      border-bottom: 4px solid #f7b731;
    }
    .app-name {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .app-name span {
      background: #f7b731;
      color: #0f1a26;
      font-size: 16px;
      font-weight: 600;
      padding: 0 12px;
      border-radius: 40px;
      line-height: 28px;
      letter-spacing: 0.3px;
    }
    .app-sub {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      font-weight: 400;
      margin-top: 4px;
      letter-spacing: 0.2px;
    }
    .email-body {
      padding: 36px 32px 28px 32px;
      background: #ffffff;
    }
    .greeting {
      font-size: 22px;
      font-weight: 600;
      color: #0b1a2b;
      margin-bottom: 8px;
    }
    .greeting small {
      font-weight: 400;
      font-size: 16px;
      color: #4a5b6b;
    }
    .otp-card {
      background: #f2f6fe;
      border-radius: 20px;
      padding: 24px 20px;
      margin: 22px 0 18px 0;
      text-align: center;
      border: 1px dashed #b8cef0;
    }
    .otp-code {
      font-size: 44px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #0b1a2b;
      background: white;
      padding: 12px 8px;
      border-radius: 16px;
      display: inline-block;
      min-width: 220px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.02);
      font-family: 'Courier New', monospace;
      border: 1px solid #d9e6f5;
    }
    .otp-hint {
      color: #2d4b6e;
      font-weight: 500;
      margin-top: 6px;
      font-size: 15px;
    }
    .expiry-badge {
      background: #fff3e0;
      border-radius: 40px;
      padding: 8px 18px;
      display: inline-block;
      font-weight: 500;
      font-size: 14px;
      color: #b45a1c;
      border: 1px solid #ffd9a8;
      margin: 10px 0 14px 0;
    }
    .expiry-badge strong {
      font-weight: 700;
      color: #9e4a0e;
    }
    .msg {
      color: #1f3347;
      line-height: 1.6;
      font-size: 15px;
      margin: 18px 0 16px 0;
    }
    .support-line {
      background: #f8faff;
      padding: 16px 18px;
      border-radius: 18px;
      border-left: 4px solid #f7b731;
      margin: 22px 0 16px 0;
      font-size: 14px;
      color: #1f3347;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 4px;
    }
    .support-line a {
      color: #1e5a9b;
      font-weight: 600;
      text-decoration: none;
      border-bottom: 1px dotted rgba(30, 90, 155, 0.3);
    }
    .support-line a:hover {
      border-bottom: 2px solid #1e5a9b;
    }
    .founder {
      display: flex;
      justify-content: flex-end;
      font-size: 13px;
      color: #60758b;
      margin-top: 6px;
      border-top: 1px solid #e9eff5;
      padding-top: 16px;
      letter-spacing: 0.2px;
    }
    .founder strong {
      color: #0b1a2b;
      font-weight: 600;
      margin-left: 4px;
    }
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #8a9cb0;
      padding: 14px 32px 20px 32px;
      background: #fafcff;
      border-top: 1px solid #e6edf6;
    }
    .footer-note span {
      opacity: 0.7;
    }
    /* responsive */
    @media (max-width: 480px) {
      .email-body { padding: 28px 18px; }
      .otp-code { font-size: 34px; letter-spacing: 6px; min-width: 160px; }
      .app-name { font-size: 24px; flex-wrap: wrap; }
      .support-line { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- header -->
    <div class="email-header">
      <div class="app-name">
        Insta_CloneF
        <span>🔐</span>
      </div>
      <div class="app-sub">secure • instant • clone</div>
    </div>

    <!-- body -->
    <div class="email-body">
      <div class="greeting">
        Hello 👋${email} <small>verify your identity</small>
      </div>

      <!-- OTP card -->
      <div class="otp-card">
        <div class="otp-code" id="otpDisplay">${otp}</div>
        <div class="otp-hint">one‑time password</div>
      </div>

      <!-- expiry info -->
      <div style="text-align: center;">
        <div class="expiry-badge">
          ⏳ expires in <strong>5 minutes</strong>
        </div>
      </div>

      <p class="msg">
        Use the code above to complete your action. <br>
        If you didn’t request this, you can safely ignore this email.
      </p>

      <!-- support + founder inline -->
      <div class="support-line">
        <span>📧 support: </span>
        <a href="mailto:meshram.abhinav1998@gmail.com">meshram.abhinav1998@gmail.com</a>
        <span style="margin-left: auto; opacity: 0.6;">•</span>
        <span style="font-weight: 400; color: #3f5a77;">founder: <strong>Abhinav Meshram</strong></span>
      </div>

      <!-- extra founder mention (clean) -->
      <div class="founder">
        <span>✨ built with ❤️ by <strong>Abhinav Meshram</strong> &nbsp;·&nbsp; Insta_CloneF</span>
      </div>
    </div>

    <!-- footer -->
    <div class="footer-note">
      <span>This is an automated message from Insta_CloneF. </span>
      <span style="display:inline-block; margin:0 4px;">•</span>
      <span>OTP valid for 5 minutes.</span>
    </div>
  </div>

</body>
</html>
    `
}