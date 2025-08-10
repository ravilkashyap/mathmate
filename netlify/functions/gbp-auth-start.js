exports.handler = async (event) => {
  const clientId = process.env.GBP_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: 'Missing GBP_CLIENT_ID env var' };
  }
  // Infer redirect URI from current host, fallback to Netlify URL env if present
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const proto = (event.headers['x-forwarded-proto'] || 'https');
  const baseUrl = process.env.URL || `${proto}://${host}`;
  const redirectUri = `${baseUrl}/.netlify/functions/gbp-auth-callback`;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'https://www.googleapis.com/auth/business.manage',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return {
    statusCode: 302,
    headers: { Location: authUrl },
    body: ''
  };
};
