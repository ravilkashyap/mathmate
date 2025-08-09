exports.handler = async function(){
  const PLACE_ID = process.env.PLACE_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  if(!PLACE_ID || !API_KEY){
    return { statusCode: 200, body: JSON.stringify([]) };
  }
  try{
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(PLACE_ID)}&fields=reviews&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const reviews = (data.result?.reviews||[]).map(r=>({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      relative_time_description: r.relative_time_description,
      profile_photo_url: r.profile_photo_url
    }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviews) };
  }catch(err){
    return { statusCode: 200, body: JSON.stringify([]) };
  }
};
