# Brand and Facebook assets

The header uses the original uploaded emblem with CSS brightness and multiply blending. The hero uses `public/brand/tio-philo-emblem-dark-transparent.png`, adapted from the user's original dark/reverse JPG using the built-in image-generation tool. Both the outside background and the light regions inside the badge are alpha transparent, so the site's background shows through the lettering, portrait, and border details. The dark brown artwork remains. The original JPG is retained as a reference.

`BrandLogo` chooses between the header and hero assets using its `large` boolean prop. CSS frames their surrounding margins. The hero has normal blending and no brightness filter because its background is genuinely transparent.

Final logo prompt (the second edit, applied after removing the outer background):

> Edit target: the provided Tio Philo Coffee Corner dark reverse logo. Make ALL light ivory/cream regions genuinely alpha transparent, including the outer page background if any, lettering 'TIO PHILO' and 'COFFEE CORNER', all cream border lines, rays, face and shirt, cup details, cross and book. Preserve all dark coffee-brown badge artwork, shapes, typography, portrait identity and exact composition. This must be a single dark-brown ink cutout logo with fully transparent negative spaces both outside and INSIDE the emblem, so the website background shows through every formerly ivory area. Do not fill transparent areas with white, ivory, black or any other color. No redesign, no new text, no shadows, no added texture. Preserve the same canvas proportions and badge placement as the provided transparent PNG so it can replace that asset in an existing website layout. Output a transparent PNG.

## Drink placeholder line art

`src/components/drink-line-art.tsx` contains three original continuous SVG paths: a hot coffee cup, a creamy iced drink, and a citrus refresher. These are editable vector code, with no generated raster files. All share one viewBox and inherit their stroke color through `currentColor`. The drawing is decorative and hidden from screen readers; the visible caption identifies the drink category.

`DrinkPhoto.illustration` selects the drawing while `src` is null. Adding a real photo automatically replaces the drawing. Styling is under `.photo-placeholder .drink-line-art` in `globals.css`.

## Love Wall illustration

Saved file: `public/brand/tio-philo-love-wall.png`.

Created with the built-in image-generation tool, using the supplied Love Wall illustration as the edit target. The result is a transparent PNG with brown line art; the page imports it as a static image. The card title and explanatory copy are real HTML/JSX text, so you can edit them in `src/app/page.tsx`.

Final prompt:

> Edit target: the last attached image showing The Love Wall, an easel sign with floral arrangement on the left and a draped round table holding pens and a vase on the right. Preserve its charming composition and fine vintage hand-drawn outline style. Remove the entire beige paper background and paper texture, producing genuinely transparent background. Render the outlines in a single warm dark coffee brown #744A2D. Keep the handwritten sign text 'The Love Wall' with the small heart. No border, no extra text, no added scenery. Crisp legible line art for a simple ivory coffee catering website, all objects fully visible with small even margins.

## Facebook QR

The supplied screenshot is retained unchanged as `public/brand/tio-philo-facebook-qr.png`. Decoding it produced `https://scanned.page/jQ1cMM`. A direct HTTP check reached the QR service's JavaScript landing page, so its eventual Facebook redirect could not be confirmed.

The user confirmed the official address as `https://www.facebook.com/tiophilo`. The website uses a new deterministic QR, `public/brand/tio-philo-facebook-qr.svg`, encoding that URL directly. It was generated with the npm `qrcode` CLI, without adding an application dependency:

```powershell
npm.cmd exec --yes --package=qrcode -- qrcode -t svg -o public/brand/tio-philo-facebook-qr.svg -e M -q 4 https://www.facebook.com/tiophilo
```

`-e M` selects medium error correction; `-q 4` retains a four-module white quiet zone around the code. Keep it black on white and avoid cropping or decorative overlays. `site.facebookUrl` controls the clickable destination; `site.facebookQr` selects the graphic. If the Facebook address changes, update the link and regenerate the QR with the same address.

The SVG is a public image asset, comparable to a Salesforce Static Resource. The browser renders it inside Next.js `Image`; it does not run a QR-generation library on visitors' devices.
