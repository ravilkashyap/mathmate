const { getAccessToken } = require('./gbp-client');

exports.handler = async () => {
  try {
    const token = await getAccessToken();
    const account = process.env.GBP_ACCOUNT_ID; // format: accounts/1234567890
    const location = process.env.GBP_LOCATION_ID; // format: locations/12345678901234567890
    if (!account || !location) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${account}/${location}/localPosts`; // posts API may differ by version
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return { statusCode: 200, body: JSON.stringify([]) };
    const data = await res.json();
    const posts = (data.localPosts || data.posts || []).map(p => ({
      title: p.summary || p.callToAction?.actionType || 'Update',
      date: p.createTime || p.updateTime,
      excerpt: p.summary || '',
      image: p.media?.[0]?.googleUrl || '',
      link: p.searchUrl || p.name || ''
    }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(posts) };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify([]) };
  }
};
