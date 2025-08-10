const { getAccessToken } = require('./gbp-client');

exports.handler = async () => {
  try {
    const token = await getAccessToken();
    // List accounts
    const accRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const accounts = await accRes.json();
    const accountName = (accounts.accounts && accounts.accounts[0]?.name) || '';

    // List locations for first account
    let locations = [];
    if (accountName) {
      const locRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const locs = await locRes.json();
      locations = locs.locations || [];
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accounts: accounts.accounts || [], locations })
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
