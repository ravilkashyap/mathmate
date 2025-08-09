# Product Requirements Document (PRD)
**Project:** Math‑Mate Tuition Centre Website
**Author:** Ravil
**Date:** 2025‑08‑10
**Version:** 1.1

---

## 1. Purpose
Design and build a professional, responsive website for Math‑Mate Tuition Centre that promotes the centre’s teaching philosophy, showcases its unique methods, and attracts potential students and parents for Classes 8–12 across ICSE, CBSE, and State syllabi.
Note: Signboard says Grades VI–X — please confirm final range (VI–X vs VIII–XII).

---

## 2. Goals
- Present Math‑Mate as the go‑to place for quality maths tuition.
- Showcase methods via a homepage carousel.
- Clear navigation for Courses, Approach, About, Contact.
- Drive inquiries via a contact form, WhatsApp, and call links.

**KPIs**
- Form submissions
- WhatsApp and call clicks
- Optional: carousel engagement

---

## 3. Target Audience
- Students in Classes 8–12 (ICSE, CBSE, State) — pending confirmation vs VI–X
- Parents seeking reliable, proven maths support

---

## 4. Core Features
### 4.1 Homepage
- Hero with headline, description, CTA buttons (Call, WhatsApp, Contact)
- Teaching Methods carousel (auto-play, swipe)
- Quick links to Approach and Courses
- Key Benefits grid: Constructive Approach, Individual Attention, Concept‑Based Teaching, Chapter‑wise Tests, Regular Feedback

### 4.2 Courses Page
- Boards: ICSE, CBSE, State
- Classes per board with topic highlights
- Batch details (size, timings, offline/online)

### 4.3 Method / Approach Page
- Constructive → Concept → Practice → Performance
- Assessments and feedback loops

### 4.4 Vedic Maths (optional)
- Overview, sample tricks, benefits, optional video

### 4.5 Gallery
- Grid of class photos, whiteboard shots, workshops

### 4.6 Reviews
- Curated testimonials; optional Google reviews embed

### 4.7 About
- Tutor bio, experience, values

### 4.8 Contact
- Contact form with validation + honeypot
- WhatsApp deeplink and click‑to‑call
- Google Maps embed with address
- Thank‑you page after submission

---

## 5. Content Requirements
- Logo: use current signboard style (teal/green accent) as reference
- Brand colors and typography (see Branding)
- Text for headings, descriptions, testimonials (placeholders to start)
- Courses list and topics (placeholders)
- Contact details: phone, WhatsApp, email, address (placeholders)

---

## 6. Technical Requirements
- Tech Stack: HTML, Tailwind CSS, vanilla JS
- Tailwind: start via CDN or with build step (see Decision Points)
- Hosting: TBD (decide between Netlify or Vercel later; both supported in this PRD)
- Forms: Netlify Forms (if Netlify) or Formspree/Web3Forms (if Vercel)
- Carousel: accessible, touch/swipe friendly, minimal JS
- SEO: meta tags, Open Graph/Twitter, canonical, robots.txt, sitemap.xml
- Structured Data: LocalBusiness/EducationalOrganization schema
- Performance budget: LCP < 2.5s, CLS < 0.1, CSS < 60KB
- Images: WebP preferred, `srcset`, `loading="lazy"`

---

## 7. UI/UX & Accessibility
- Mobile‑first responsive design
- High contrast, visible focus states
- Keyboard‑navigable components (carousel, menus, forms)
- `prefers-reduced-motion` respected (pause animations)
- Alt text for all images
- Clear CTAs

---

## 8. Carousel Specification
**Slide fields**
- Image (WebP/JPG/PNG, optimized)
- Title (≤ 50 chars)
- Description (≤ 120 chars)
- Optional link (internal)

**Behavior**
- Auto‑rotate every 4–5s
- Pause on hover (desktop)
- Swipe gestures (mobile)
- Next/prev buttons + pagination dots
- ARIA roles, keyboard left/right navigation

**Example JSON**
```json
[
  {
    "image": "assets/img/post1.webp",
    "title": "Vedic Maths Workshop",
    "description": "Rapid multiplication tricks for faster problem-solving.",
    "link": "vedic-maths.html"
  },
  {
    "image": "assets/img/post2.webp",
    "title": "Chapter-Wise Tests",
    "description": "Regular assessments to track progress.",
    "link": "method.html"
  }
]
```

---

## 9. Analytics
- Track clicks on Call, WhatsApp, Directions
- Track form submissions
- Optional: carousel interaction
- Choice: GA4 (free) or none in Phase 1; Plausible in Phase 2 (optional)

---

## 10. SEO Plan
- Keywords: “Math Tuition Classes 8–12 Bangalore”, “ICSE CBSE State Maths Coaching”, “Math‑Mate Tuition Centre”
- Local SEO: Google Business Profile integration
- Structured data: EducationalOrganization/LocalBusiness
- Future: blog for tips and solved problems

---

## 11. Branding (inspired by signboard)
- Colors
  - Primary Teal: #11BFA6 (buttons, accents)
  - Secondary Coral: #E8845A (hero background/accent)
  - Dark Text: #1F2937
  - Light Background: #FAFAF9
  - Accent Yellow (optional): #F4C542
- Typography
  - Headings: Source Serif 4 (or Playfair Display alt)
  - Body/UI: Inter
- Buttons
  - Primary: teal solid, white text, rounded‑md
  - Hover: darken teal; focus ring visible

---

## 12. Legal/Privacy
- Simple Privacy page
- Cookie notice only if analytics added (Phase 2 if GA4/Plausible)

---

## 13. Hosting & CI/CD
- GitHub repo with CI deploys
- Platform: TBD — Netlify or Vercel (decide later)
- Custom domain + DNS mapping in Phase 1

---

## 14. Deliverables
- Static website with pages above
- Optimized images and SEO meta
- Deploy on chosen host with custom domain
- Basic docs: README for edits/content updates

---

## 15. Timeline
- Phase 1 (2–3 days): Static site, carousel, core pages, contact form
- Phase 2 (1 week later): Structured data, sitemap automation, analytics, blog capability

---

## 16. Risks & Mitigation
- Large images → compress, lazy‑load, WebP
- Form spam → honeypot + time‑to‑submit
- Low engagement → review analytics monthly, iterate content

---

## 17. Open Questions
- Confirm class range: VI–X (signboard) vs VIII–XII (draft)
- Tailwind: CDN vs build step
- Carousel: micro‑lib vs vanilla
- Analytics in Phase 1: yes/no
