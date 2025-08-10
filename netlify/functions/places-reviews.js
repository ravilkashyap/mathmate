exports.handler = async function(){
  const API_KEY = process.env.GOOGLE_API_KEY;
  let PLACE_ID = process.env.PLACE_ID;
  if(!API_KEY){
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([]) };
  }
  try{
    // Resolve PLACE_ID if not provided using Find Place
    if(!PLACE_ID){
      const query = 'Math-Mate Tuition Centre, Yelahanka, Bengaluru';
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
      const fRes = await fetch(findUrl);
      const fData = await fRes.json();
      PLACE_ID = fData.candidates && fData.candidates[0]?.place_id;
    }
    if(!PLACE_ID){
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([]) };
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(PLACE_ID)}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const reviews = (data.result?.reviews||[]).map(r=>({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      relative_time_description: r.relative_time_description,
      profile_photo_url: r.profile_photo_url
    }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }, body: JSON.stringify(reviews) };
  }catch(err){
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([]) };
  }
};
