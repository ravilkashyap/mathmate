exports.handler = async function(){
  const PLACE_ID = process.env.PLACE_ID; // e.g., ChIJ...
  const API_KEY = process.env.GOOGLE_API_KEY;
  if(!PLACE_ID || !API_KEY){
    return { statusCode: 200, body: JSON.stringify([]) };
  }
  try{
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(PLACE_ID)}&fields=photo&key=${API_KEY}`;
    const res = await fetch(detailsUrl);
    const data = await res.json();
    const photos = (data.result?.photos||[]).map(p=>`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${p.photo_reference}&key=${API_KEY}`);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(photos) };
  }catch(err){
    return { statusCode: 200, body: JSON.stringify([]) };
  }
};
