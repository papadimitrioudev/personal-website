# PapadimitriouDev

The bilingual personal website of Panagiotis Papadimitriou: Computer Science graduate, technician at Germanos and MSc Data Analytics student.

Dark navy, a yellow signal accent and an original geometric P monogram. The hero features a dimensional emblem that sends out signal rings, with a light travelling around its frame. Type is set in Commissioner, a variable typeface by Greek designer Kostas Bartsokas, used for both Greek and English. The copy focuses on work experience, education and the tools I am learning.

Built with AI assistance in HTML, CSS and JavaScript. No framework, package installation, build step, tracking, third-party fonts or third-party scripts. The font files are hosted with the site.

### Effects adapted from Magic UI

Magic UI (magicui.design, MIT licence) is a React component library. Its effects are rebuilt here in plain CSS and JavaScript, so the site keeps working without a build step and within the strict Content Security Policy:

- Blur Fade: the introduction appears once on page load.
- Ripple: rings behind the emblem.
- Border Beam: a light travelling around the emblem frame.
- Shiny Button: a light sweep on the main button when hovered or focused.
- Magic Card: the learning cards' border and spotlight follow the pointer.
- Animated Beam and pulsating ripple: once, a light runs up the experience timeline and the current role pulses.
- Scroll Progress: a thin line under the header shows the reading position.
- Dot Pattern: a faint dot grid in the contact section.

## Pages and assets

- `index.html`: English.
- `el/index.html`: Greek.
- `assets/styles.css`: fonts, layout, theme, responsive rules, CSS 3D scene and effects.
- `assets/site.js`: navigation, scroll progress, email copying, optional motion, emblem interaction, card spotlight and timeline beam.
- `assets/fonts/`: Commissioner (Latin and Greek subsets) and its licence, `OFL.txt`.
- `assets/mark.svg`: geometric P vector monogram.
- `assets/favicon-pdm.svg`, `assets/favicon-pdm-32.png`, `assets/apple-touch-icon-pdm.png`, `favicon.ico`: icons.
- `assets/social-card-v3.png`: image for shared links (`social-card-v2.png` and `social-card-final.png` are previous versions).
- `404.html`, `robots.txt`, `sitemap.xml`, `netlify.toml`: hosting and discovery.

## Content

The tools in the learning section are being learned, not claims of proficiency. Add practical projects as they are completed. Keep both languages consistent when employment, education or experience changes. The public email, LinkedIn and GitHub links come from the previous public website. The owner-approved CV is available to view and download from the introduction and contact sections.

## Preview

Serve this folder with any static web server. Opening `index.html` directly also displays the site, but a local server more accurately represents hosting. The email-copy button appears only when the browser supports clipboard access in a secure context; the email link works independently.

The content remains visible without JavaScript. Navigation, the email-copy button and the effects are progressive enhancements. Motion respects the operating system preference. A footer control can stop the optional animation and remembers the choice in local storage. Hero animation pauses when the hero is offscreen or the tab is hidden.

## Deployment

Live site: https://papadimitrioudev.netlify.app/

This repository deploys automatically from the main branch to a new Netlify project created on 22 September 2026. The original public address was transferred to this project.

- Netlify project ID: fe24238e-0d1f-4b6a-88ea-6052c57090a1
- Publish directory: .
- Build command: none
- Configuration: netlify.toml

After changing the site, check the English and Greek pages, mobile navigation, contact links and the 404 page. The two language versions should contain the same facts.

If the public domain changes, update canonical URLs, alternate-language links, Open Graph URLs, robots.txt and sitemap.xml together.

## Brand assets

The geometric P monogram is the PapadimitriouDev identity. SVG, PNG and multi-size ICO icons share the same artwork. Social avatars and transparent vector/PNG exports are provided separately in the PapadimitriouDev brand kit.

Brand naming: PapadimitriouDev is the public name; the geometric P is its logo. Internal CSS classes and existing asset filenames retain their stable identifiers.

## CV

`cv/Panagiotis_Papadimitriou_CV.pdf` is the public English CV. Both languages link to the same PDF. The view link opens a new tab; the same-origin download link supplies a filename. Replace this file when updating the CV, and keep the website facts consistent.

## Updating styles and scripts
After editing assets/styles.css or assets/site.js, run node scripts/prepare-assets.cjs before publishing. This writes content-versioned assets and updates all HTML references so returning visitors receive the matching layout and behavior. Asset responses also revalidate to avoid stale branding and document previews.
