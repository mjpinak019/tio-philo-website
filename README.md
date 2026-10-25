# Tio Philo Coffee Corner

A simple responsive event coffee website built with Next.js App Router and TypeScript. Branding and business details follow the supplied promotional flyer and PowerPoint presentation.

- **Public website:** https://tiophilo.site/
- **Source repository:** https://github.com/mjpinak019/tio-philo-website
- **Deployment status:** [GitHub Actions](https://github.com/mjpinak019/tio-philo-website/actions/workflows/deploy-pages.yml)

## Developer documentation

New to Node.js, TypeScript, React, or Next.js? These guides explain this build using Apex, LWC, and Salesforce admin comparisons:

1. [Developer guide](docs/DEVELOPER_GUIDE.md): the stack, syntax, data flow, and development/build/server process.
2. [Complete file and function reference](docs/FILE_REFERENCE.md): every project source/configuration/asset file, component, helper, and important setting.
3. [Editing playbook](docs/EDITING_PLAYBOOK.md): practical changes, validation commands, troubleshooting, and teaching exercises.
4. [GitHub Pages deployment](docs/DEPLOYMENT.md): public hosting, automatic deployments, and the static build profile.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, normally http://localhost:3000.

## Update content

- `src/lib/site.ts`: brand messages, verses, flavors, six package prices, add-ons, phone numbers, Facebook URL, and photo paths.
- `src/app/page.tsx`: service, menu, packages, Love Wall, faith, and booking sections.
- `src/app/globals.css`: layout, responsive styles, and brand colors.
- `public/brand/tio-philo-emblem.png`: the uploaded logo, copied without alteration. CSS frames the emblem to hide the source image's outer margins.
- `public/brand/tio-philo-emblem-dark.jpg`: the supplied reverse-color logo used by the large hero variant. The header uses the original logo with CSS blending and brightness to match the background.
- `public/brand/tio-philo-love-wall.png`: transparent brown Love Wall illustration used inside the labeled Love Wall card. See [asset notes](docs/ASSET_NOTES.md) for its source and generation prompt.
- `public/brand/tio-philo-facebook-qr.svg`: QR code linking directly to `https://www.facebook.com/tiophilo`; `site.facebookQr` selects this file.
- `public/brand/tio-philo-flyer-v3.png`: the updated flyer, accessible from the homepage. The original flyer remains in `public/brand/tio-philo-flyer.png` as an earlier reference.

## Add actual drink photos

1. Place photos in `public/photos/`, for example `coffee.jpg`, `milk-drinks.jpg`, and `refreshers.jpg`.
2. In `src/lib/site.ts`, replace each `drinkPhotos` entry's `src: null` with the path, such as `src: "/photos/coffee.jpg"`.
3. Set each photo's `alt` text to accurately describe the image. Keep `src: null` to retain a clean placeholder.

The photos use `object-fit: cover`; landscape images around 1200 × 900 pixels work well. No stock or generated drink photos are presented as actual products.

## Brand references

- Fonts: **EB Garamond** for headings and **Inter** for body text, as specified in the presentation.
- Colors: ivory `#F8F0E1`, dark brown `#4D2C1A`, and lighter brown `#744A2D`.
- Brand message: “Where Every Cup Brings Hearts Together.” The faith section reproduces Isaiah 60:22b (ERV) and Romans 12:15–16 (ESV) as printed on the updated flyer; edit these values in `site.ts`.
- Readability: body text uses 16px, most secondary text and links use 14px, and small section labels use 12px at the default browser font size. These sizes are shared CSS tokens, and the mobile layouts make room for them.
- Fonts are stored in `src/assets/fonts` and served locally using `next/font/local`, with their OFL licenses. Builds and visitors do not need a Google Fonts connection.
- `scripts/prepare-brand-fonts.ps1` can redownload the fonts and licenses if needed.

The official Facebook page is `https://www.facebook.com/tiophilo`. The contact section includes a clickable QR code and a direct Facebook link. Update both `site.facebookUrl` and the QR graphic if the destination changes. Both phone numbers are working telephone links. Event booking is handled directly with the business; this site does not take payments or submit bookings.

## Production check

```bash
npm run build
npm start
```

Read the installed guides in `node_modules/next/dist/docs/` before changing Next.js APIs or configuration, as required by `AGENTS.md`.

## GitHub Pages

The public repository is configured to publish through **GitHub Actions** using `.github/workflows/deploy-pages.yml`. Pushes to `main` build and deploy the website automatically.

The workflow uses Node.js 24, installs locked dependencies with `npm ci`, runs `npm run build:pages`, verifies the export, and publishes `out/`. It obtains the repository URL prefix from GitHub Pages automatically, so the logo, fonts, flyer, and future drink photos work under a project URL.

The custom domain `tiophilo.site` serves the site at `/`, with no repository prefix. After changing a custom domain in GitHub Pages settings, run the deployment workflow again so the compiled asset paths match the new address.

For a local static build at the domain root:

```bash
npm run build:pages
npm run verify:pages
```

See [deployment instructions](docs/DEPLOYMENT.md) for publishing updates, testing a repository URL prefix, and checking deployment results.
