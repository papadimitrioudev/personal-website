# PapadimitriouDev

The bilingual personal website of Panagiotis Papadimitriou: Computer Science graduate, technical support professional and MSc Data Analytics student.

Dark navy and black, yellow accents, restrained red details and an original geometric P monogram. The hero features a dimensional emblem, orbital lines and subtle motion. The copy focuses on current experience, education and the intended move into data analytics.

Built with AI assistance in HTML, CSS and JavaScript. No framework, package installation, build step, tracking, external fonts or third-party scripts.

## Pages and assets

- `index.html`: English.
- `el/index.html`: Greek.
- `assets/styles.css`: layout, theme, responsive rules and CSS 3D scene.
- `assets/site.js`: navigation, email copying, optional motion and emblem interaction.
- `assets/mark.svg`: geometric P vector monogram.
- `assets/favicon-pdm.svg`, `assets/favicon-pdm-32.png`, `assets/apple-touch-icon-pdm.png`, `favicon.ico`: icons.
- `assets/social-card-final.png`: image for shared links.
- `404.html`, `robots.txt`, `sitemap.xml`, `netlify.toml`: hosting and discovery.

## Content

Learning priorities are future goals rather than claims of proficiency. Add practical projects as they are completed. Keep both languages consistent when employment, education or experience changes. The public email, LinkedIn and GitHub links come from the previous public website. The owner-approved CV is available to view and download from the introduction and contact sections.

## Preview

Serve this folder with any static web server. Opening `index.html` directly also displays the site, but a local server more accurately represents hosting. The email-copy button appears only when the browser supports clipboard access in a secure context; the email link works independently.

The content remains visible without JavaScript. Navigation and the email-copy button are progressive enhancements. Motion respects the operating system preference. A footer control can stop the optional animation and remembers the choice in local storage. Animation pauses when the hero is offscreen or the tab is hidden.

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
