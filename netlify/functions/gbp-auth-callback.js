exports.handler = async (event) => {
  try {
    const code = new URL(event.rawUrl).searchParams.get('code');
    if (!code) return { statusCode: 400, body: 'Missing code' };

    const client_id = process.env.GBP_CLIENT_ID;
    const client_secret = process.env.GBP_CLIENT_SECRET;
    const host = event.headers['x-forwarded-host'] || event.headers.host;
    const proto = (event.headers['x-forwarded-proto'] || 'https');
    const baseUrl = process.env.URL || `${proto}://${host}`;
    const redirect_uri = `${baseUrl}/.netlify/functions/gbp-auth-callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code'
      })
    });
    const token = await tokenRes.json();
    if (!token.refresh_token) {
      return { statusCode: 200, body: `No refresh_token returned. Response: ${JSON.stringify(token)}` };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!doctype html><html><body style="font-family:system-ui;padding:20px"><h1>Google Auth Complete</h1>
        <p>Copy this value and add it in Netlify env vars as <code>GBP_REFRESH_TOKEN</code>:</p>
        <pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px">${token.refresh_token}</pre>
        <p>Then redeploy the site. You can close this tab.</p>
      </body></html>`
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
