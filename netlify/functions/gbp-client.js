const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

async function getAccessToken() {
  const refresh_token = process.env.GBP_REFRESH_TOKEN;
  const client_id = process.env.GBP_CLIENT_ID;
  const client_secret = process.env.GBP_CLIENT_SECRET;
  if (!refresh_token || !client_id || !client_secret) {
    throw new Error('Missing GBP refresh or client env vars');
    }
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get access token');
  return data.access_token;
}

async function gbpFetch(path) {
  const token = await getAccessToken();
  const res = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`GBP API error: ${res.status}`);
  return res.json();
}

module.exports = { getAccessToken, gbpFetch };
