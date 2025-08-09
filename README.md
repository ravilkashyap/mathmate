# Math‑Mate Website

Static site: HTML + Tailwind (CDN) + vanilla JS. Deployed on Netlify with serverless functions for Google reviews/photos.

## Local dev
```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy (Netlify)
1. Push this folder to a new GitHub repo.
2. On Netlify: New site from Git → select repo.
3. Build settings: Base directory “/”, Publish directory “/”, Functions “netlify/functions”. No build command.
4. After deploy, set Environment variables:
   - `GOOGLE_API_KEY`: Google Cloud API key (restrict to Places API)
   - `PLACE_ID`: Place ID for Math‑Mate Tuition Centre
5. Redeploy site.

## Get a Google API key
- Create a project at Google Cloud Console.
- Enable “Places API”.
- Create an API key. Restrict:
  - API restrictions: Places API
  - Application restrictions: HTTP referrers (your Netlify domain)

## Find Place ID
Use Google’s Place ID finder and search your business. Example: https://developers.google.com/maps/documentation/places/web-service/place-id

## Endpoints
- `/.netlify/functions/places-photos` → returns array of photo URLs
- `/.netlify/functions/places-reviews` → returns array of reviews

## Customization
- Logo: replace `assets/img/logo.svg` or add your `logo.png` and update `index.html`.
- Colors: edit CSS variables in `assets/css/styles.css`.
- Slides: edit array in `assets/js/carousel.js`.

## Notes
- Google Posts/Updates are not exposed via Places API. Reviews and photos are supported. Use Business Profile API (OAuth) if you later want posts.
