# Brand and Facebook assets

The header uses the original uploaded emblem with CSS brightness and multiply blending. The hero uses the user's original dark/reverse JPG. Both source logo images are copied without modification; `BrandLogo` chooses between them using its `large` boolean prop. CSS frames their surrounding margins.

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
