export const verifyEmailTemplate= (email,otp)=>{
 return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insta_CloneF · OTP Email</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background-color: #f0f4f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }

    .email-wrapper {
      max-width: 580px;
      width: 100%;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.10);
      overflow: hidden;
    }

    /* HEADER */
    .email-header {
      background: #0f1a2b;
      padding: 32px 36px 24px 36px;
    }

    .app-name {
      font-size: 30px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-name .badge {
      background: #f7b731;
      color: #0f1a2b;
      font-size: 14px;
      font-weight: 600;
      padding: 2px 16px;
      border-radius: 30px;
      letter-spacing: 0.3px;
    }

    .app-sub {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-top: 4px;
      letter-spacing: 0.3px;
    }

    /* BODY */
    .email-body {
      padding: 36px 36px 28px 36px;
    }

    .greeting {
      font-size: 22px;
      font-weight: 600;
      color: #0a1628;
      margin-bottom: 6px;
    }

    .greeting small {
      font-weight: 400;
      font-size: 16px;
      color: #5a6f85;
    }

    /* OTP CARD */
    .otp-card {
      background: #f4f8ff;
      border-radius: 18px;
      padding: 28px 20px 22px;
      margin: 20px 0 18px 0;
      text-align: center;
      border: 1px dashed #c5d8ef;
    }

    .otp-code {
      font-size: 46px;
      font-weight: 700;
      letter-spacing: 10px;
      color: #0a1628;
      background: #ffffff;
      padding: 14px 12px;
      border-radius: 14px;
      display: inline-block;
      min-width: 240px;
      font-family: 'Courier New', monospace;
      border: 1px solid #dce7f5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .otp-hint {
      color: #2a4a6e;
      font-weight: 500;
      margin-top: 8px;
      font-size: 15px;
    }

    .expiry-badge {
      background: #fff4e6;
      border-radius: 40px;
      padding: 8px 22px;
      display: inline-block;
      font-weight: 500;
      font-size: 14px;
      color: #a65a1a;
      border: 1px solid #fadcb8;
      margin: 10px 0 16px 0;
    }

    .expiry-badge strong {
      font-weight: 700;
      color: #8a4508;
    }

    .msg {
      color: #1a2f44;
      line-height: 1.7;
      font-size: 15px;
      margin: 18px 0 24px 0;
    }

    /* ========== SUPPORT SECTION - PROFESSIONAL ========== */
    .support-section {
      background: #f7faff;
      border-radius: 18px;
      border: 1px solid #e6eef9;
      padding: 6px 0;
      margin: 20px 0 12px 0;
      overflow: hidden;
    }

    .support-row {
      display: flex;
      align-items: center;
      padding: 14px 22px;
      gap: 16px;
      border-bottom: 1px solid #eef3fa;
    }

    .support-row:last-child {
      border-bottom: none;
    }

    .support-icon-wrap {
      width: 42px;
      height: 42px;
      min-width: 42px;
      background: #e4edf9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .support-text {
      flex: 1;
    }

    .support-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #7a94b3;
      font-weight: 600;
    }

    .support-value {
      font-size: 16px;
      font-weight: 500;
      color: #0a1628;
      margin-top: 1px;
    }

    .support-value a {
      color: #1a6bb0;
      text-decoration: none;
      font-weight: 600;
    }

    .support-value a:hover {
      text-decoration: underline;
    }

    .founder-chip {
      display: inline-block;
      background: #e8f0fe;
      padding: 2px 16px;
      border-radius: 30px;
      font-size: 13px;
      font-weight: 500;
      color: #1a3a5e;
      margin-left: 10px;
      border: 1px solid #d0dff0;
    }

    .founder-chip strong {
      color: #0a1628;
      font-weight: 700;
    }

    /* FOOTER */
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #8a9eb5;
      padding: 16px 36px 22px 36px;
      border-top: 1px solid #eef3fa;
      background: #fafcff;
    }

    .footer-note span {
      opacity: 0.8;
    }

    .footer-note .dot {
      display: inline-block;
      margin: 0 6px;
      opacity: 0.4;
    }

    /* RESPONSIVE */
    @media (max-width: 480px) {
      .email-body {
        padding: 24px 18px 20px 18px;
      }
      .email-header {
        padding: 24px 18px 18px 18px;
      }
      .app-name {
        font-size: 24px;
      }
      .otp-code {
        font-size: 34px;
        letter-spacing: 6px;
        min-width: 180px;
        padding: 10px 8px;
      }
      .support-row {
        padding: 12px 16px;
        gap: 12px;
        flex-wrap: wrap;
      }
      .support-icon-wrap {
        width: 36px;
        height: 36px;
        min-width: 36px;
        font-size: 16px;
      }
      .support-value {
        font-size: 15px;
      }
      .founder-chip {
        margin-left: 0;
        margin-top: 4px;
        display: inline-block;
      }
      .footer-note {
        padding: 14px 18px 18px 18px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- HEADER -->
    <div class="email-header">
      <div class="app-name">
        Insta_CloneF
        <span class="badge">🔐 OTP</span>
      </div>
      <div class="app-sub">Secure authentication · instant delivery</div>
    </div>

    <!-- BODY -->
    <div class="email-body">
      <div class="greeting">
        Hello there ${email.split("@")[0].toUpperCase()}   👋
      👋 <small>verify your identity</small>
      </div>

      <!-- OTP CARD -->
      <div class="otp-card">
        <div class="otp-code" id="otpDisplay">${otp}</div>
        <div class="otp-hint">Your one-time verification code</div>
      </div>

      <!-- EXPIRY -->
      <div style="text-align: center;">
        <div class="expiry-badge">
          ⏳ This OTP will expire in <strong>5 minutes</strong>
        </div>
      </div>

      <p class="msg">
        Use the code above to complete your authentication.<br>
        If you didn't request this, please ignore this email.
      </p>

      <!-- ===== SUPPORT SECTION - CLEAN & PROFESSIONAL ===== -->
      <div class="support-section">
        <!-- Row 1: Support Email -->
        <div class="support-row">
          <div class="support-icon-wrap">📧</div>
          <div class="support-text">
            <div class="support-label">Support Email</div>
            <div class="support-value">
              <a href="mailto:meshram.abhinav1998@gmail.com">meshram.abhinav1998@gmail.com</a>
            </div>
          </div>
        </div>

        <!-- Row 2: Founder -->
        <div class="support-row">
          <div class="support-icon-wrap">👤</div>
          <div class="support-text">
            <div class="support-label">Founder</div>
            <div class="support-value">
              Abhinav Meshram
              <span class="founder-chip">👑 Insta_CloneF</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Extra note -->
      <div style="text-align: center; font-size: 13px; color: #7a94b3; margin-top: 14px;">
        ⚡ For immediate assistance, reply to this email
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-note">
      <span>This is an automated message from Insta_CloneF</span>
      <span class="dot">•</span>
      <span>OTP valid for 5 minutes</span>
      <span class="dot">•</span>
      <span>© 2026 Insta_CloneF</span>
    </div>
  </div>
</body>
</html>
 `
}