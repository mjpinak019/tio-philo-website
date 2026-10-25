# Editing and maintaining Tio Philo

Use this as a practical companion to the [developer guide](DEVELOPER_GUIDE.md) and [file reference](FILE_REFERENCE.md). Most content changes need only `site.ts`; most visual changes need only `globals.css`.

For public hosting and the separate static build profile, see [GitHub Pages deployment](DEPLOYMENT.md). The commands below describe the normal local development and Node.js production profile unless stated otherwise.

The recipes below describe changes you can make. They have not been applied to the website just by appearing in this document. Sample prices and URLs are teaching examples, not new business facts.

Before experimenting, use `git status` and `git diff` to check your existing work. The project has a Git repository and a public GitHub remote. Make one small change at a time and restore practice prices/copy before publishing.

## 1. Open the project and preview it

In PowerShell:

```powershell
Set-Location 'C:\Users\USER\tio-philo-website'
node --version
npm.cmd --version
```

If dependencies are missing, install them:

```powershell
npm.cmd install
```

For a clean installation matching the existing lockfile, use `npm.cmd ci` instead. It replaces the installed dependency directory; do not run it while another install or server is using those files.

Start the editing server:

```powershell
npm.cmd run dev
```

Keep this terminal open. Open the Local URL printed by Next.js, usually `http://localhost:3000`. Saving source normally updates the development preview. Press **Ctrl+C** in the server terminal to stop it.

If you also need terminal commands while the server runs, open a second terminal in the same project directory.

Starting the preview does not deploy the project, register a domain, connect Salesforce, or make the page available to other people on the internet.

## 2. Choose the right file

| Change | File | Additional consideration |
| --- | --- | --- |
| Brand message or faith heading | [site.ts](../src/lib/site.ts) | Edit `site.tagline` or `site.faithMessage` |
| Verses and references | [site.ts](../src/lib/site.ts) | Edit `verses`; keep the quotation, reference, and translation label together |
| Package price or cup count | [site.ts](../src/lib/site.ts) | Keep numeric values; maintain unique cup-count keys |
| Drink names or categories | [site.ts](../src/lib/site.ts) | Keep names/categories unique within their lists |
| Phone number | [site.ts](../src/lib/site.ts) | Update display label and telephone URL |
| Official Facebook page | [site.ts](../src/lib/site.ts) | Update `facebookUrl` and regenerate the QR graphic with the same destination |
| Facebook QR code | `public/brand/tio-philo-facebook-qr.svg` | `site.facebookQr` selects it; changing the link alone does not change the encoded QR data |
| Love Wall illustration | `public/brand/tio-philo-love-wall.png` | Imported in `page.tsx`; sizing and card appearance are in `.love-note` CSS rules |
| Real drink photo | `public/photos/` and [site.ts](../src/lib/site.ts) | Copy the file and set `src`/`alt` |
| Business name everywhere | [site.ts](../src/lib/site.ts), [page.tsx](../src/app/page.tsx), logo assets | Some visible copy and logo text are not generated from `site.name` |
| Search/browser description | [site.ts](../src/lib/site.ts) | `layout.tsx` reads it for metadata |
| Main headline or service copy | [page.tsx](../src/app/page.tsx) | Preserve valid JSX and accessibility associations |
| Colors, spacing, breakpoints | [globals.css](../src/app/globals.css) | Review desktop and mobile rules |
| Uploaded emblem | `public/brand/tio-philo-emblem.png` | Different image margins may need CSS adjustment |
| Flyer | `public/brand/tio-philo-flyer-v3.png` | Replace the image or update `site.flyer` to a new filename |
| Fonts | [layout.tsx](../src/app/layout.tsx), `src/assets/fonts/` | Keep font paths, weights/styles, and license files consistent |
| Add an entirely new URL/page | A new `src/app/<route>/page.tsx` | Root layout is shared; homepage header/footer are not |
| Dependency or npm command | [package.json](../package.json) | Use npm to update dependencies and the lockfile together |

## 3. Change a package price

In `src/lib/site.ts`, find the relevant object:

```ts
{ cups: 50, price: 6000 },
```

For a practice change, replace the numeric price with another number:

```ts
{ cups: 50, price: 6200 },
```

Expected result: the table displays `₱6,200` automatically. Do not add quotes, commas, or the peso symbol to the stored numeric value. Restore the confirmed business price after experimenting.

The page's `formatPrice` helper handles display formatting. This is like changing a value consumed by a view, but there is no record update or DML transaction behind it.

To add a genuine new package later, add another `{ cups, price }` object. The table will render it automatically. Update any introductory copy such as “From 50 to 250 cups” if the offered range changes; that sentence is written separately in `page.tsx`.

## 4. Add or rename a drink

Add a string inside the appropriate `items` array, for example:

```ts
items: [
  "Americano",
  "Spanish Latte",
  "Caramel Macchiato",
  "White Chocolate Mocha",
  "Roasted Almond Latte",
  "Your confirmed new drink",
],
```

The nested `.map()` calls render the extra list item. No change to the page's rendering code is needed.

Keep the name unique within the category. If you need repeated display names later, add explicit stable IDs and update the React keys rather than relying on the text as identity.

## 5. Replace a photo placeholder

1. Copy your real coffee photo into `public/photos/coffee.jpg`. Choose a simple filename and use the same capitalization in code.
2. Find the matching entry in `drinkPhotos`.
3. Change it to something like:

```ts
{
  label: "Our coffee",
  alt: "Tio Philo Spanish latte served in a branded iced cup",
  src: "/photos/coffee.jpg",
},
```

Write alt text describing the actual photo. The text above is only an example; it is not a claim about an image already in this project.

The component now selects the image branch. Set `src` back to `null` to restore the placeholder.

Check the file from PowerShell if necessary:

```powershell
Test-Path -LiteralPath '.\public\photos\coffee.jpg'
```

You can also open `/photos/coffee.jpg` on the preview server. A 404 means the file/path is missing or mismatched. `src: "/public/photos/coffee.jpg"` is incorrect because `public/` is omitted from web URLs.

Landscape photos around 1200 × 900 pixels work well with the desktop frames. Mobile CSS uses different frame proportions, so verify the crop. If the subject is cut off, adjust `object-position` on the relevant image styling or choose a better-framed photo.

Do not use a local Downloads path, a Salesforce Static Resource import, or a remote image URL without the additional configuration those different sources require. This recipe uses local public files only.

## 6. Update the official Facebook link and QR

In `site.ts`, the confirmed address is:

```ts
facebookUrl: "https://www.facebook.com/tiophilo",
```

If the official address changes, update this value and regenerate the QR SVG for the same URL using the command in [asset notes](ASSET_NOTES.md). The existing ternary chooses a clickable link when the value is populated. The QR card also uses this URL when tapped, but the image contains independently encoded data, so update both.

`facebookName` only controls displayed text. It does not search Facebook or verify page ownership.

## 7. Change a contact number

Each entry has two separate values:

```ts
{ label: "0976-416-1770", href: "tel:+639764161770" },
```

The `label` is what people read. The `href` is what the device uses. Update both if the number changes.

A `tel:` link opens a supported phone handler; it does not call an API or create a Contact record. “Call or text” in the page is a human contact instruction. The current links do not automatically open an SMS composer.

## 8. Change branding or copy

### Colors

Edit the `:root` variables in `globals.css`. For example, `--accent` influences emphasized headings and certain hover states.

Some subtle decorative shades are specified directly in later rules. Review them if changing the overall palette. Check readability in the dark contact section as well as on the ivory background.

### Text size

The root CSS tokens `--text-body`, `--text-small`, and `--text-label` control normal paragraphs, secondary text, and small section labels. They currently use `1rem`, `.875rem`, and `.75rem`: normally 16px, 14px, and 12px. A `rem` is relative to the root font size, so these text sizes also follow the reader’s browser font-size preference.

Edit the shared token first rather than changing many individual selectors. Large headings, serif quotations, and some branding use separate sizes. Check mobile wrapping after increasing type: the current phone layout stacks flavor lists/photos/verses and uses a two-column navigation grid to make room for legible text.

### Brand message and verses

Edit `site.tagline` for the shared hero/footer message, `site.faithMessage` for the faith-section heading, and `verses` for the quotation text, reference, and translation. The current wording was transcribed from the updated flyer. Updating these values does not automatically edit the linked flyer image or the separately written metadata description.

### Headline

Edit the `<h1>` in `page.tsx`. Keep the `id="hero-heading"` unless you also update its associated `aria-labelledby` value. `<br />` forces a line break; `<em>` applies the emphasized treatment.

### Logo

The header uses `public/brand/tio-philo-emblem.png`; the hero uses `public/brand/tio-philo-emblem-dark.jpg`. Replace the intended file or update its import in `brand-logo.tsx`. The `large` prop chooses the asset using a ternary expression, similar to conditional template rendering in LWC. The current CSS clips the sources' surrounding page margins. A tightly cropped replacement could look cut off unless you also adjust `.brand-logo img` and the large variant's rules.

For production updates, a new asset filename can help distinguish the new image from previously cached versions. Check both the small header version and the large hero version.

### Fonts

Fonts are already installed as project files. You normally do not need the download script.

If intentionally replacing a font, add the permitted font files, retain their license information, and update the corresponding `localFont` `src` entries in `layout.tsx`. Keep the CSS variables consistent with `globals.css`.

The optional existing helper can be run from PowerShell:

```powershell
& '.\scripts\prepare-brand-fonts.ps1'
```

It needs network access and overwrites the existing five font files and two licenses. If your organization's execution policy blocks it, follow that policy; there is no reason to weaken global execution settings to run the existing website.

## 9. Add a new page: teaching example

This example is not currently implemented. Create `src/app/about/page.tsx`:

```tsx
import { site } from "@/lib/site";

export default function AboutPage() {
  return (
    <main className="wrap section-space">
      <p className="eyebrow">ABOUT US</p>
      <h1>{site.name}</h1>
      <p>Coffee service for your celebrations.</p>
    </main>
  );
}
```

The folder and special filename create `/about`. Next.js automatically wraps it in the existing root layout, so fonts and global styles apply.

The current header/footer are inside the homepage, so they would not automatically appear here. To share them, extract reusable components and render them in the appropriate shared layout. Keep each page's main-content and skip-link targets consistent.

To add navigation between routes, use Next.js's `Link` in the relevant file:

```tsx
import Link from "next/link";

// Inside returned JSX:
<Link href="/about">About Tio Philo</Link>
```

For existing in-page navigation such as `#packages`, the current ordinary anchors remain appropriate. Check the installed Next.js guide before extending routing beyond this simple example.

## 10. Add browser interactivity: teaching example

This example is not installed. It illustrates the point where you would introduce a Client Component.

Create `src/components/photo-tips.tsx`:

```tsx
"use client";

import { useState } from "react";

export function PhotoTips() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={visible}
        aria-controls="photo-tips"
        onClick={() => setVisible((previous) => !previous)}
      >
        {visible ? "Hide" : "Show"} photo tips
      </button>
      <p id="photo-tips" hidden={!visible}>
        Use a clear photo of the real drink and check the mobile crop.
      </p>
    </div>
  );
}
```

Then import and render `<PhotoTips />` from the page where needed. Its visual styling would be a separate task; it is a plain teaching button.

| Part | Explanation | LWC comparison |
| --- | --- | --- |
| `"use client"` | Marks the client module boundary for interactive logic | LWC JavaScript normally runs client-side; Next.js requires this distinction |
| `useState(false)` | Declare state with an initial boolean value | A component field used by a template |
| `[visible, setVisible]` | Extract the current value and updater from the returned pair | React does not use an `@track` declaration here |
| `onClick={...}` | Register an event callback | `onclick={handleClick}` |
| `(previous) => !previous` | Compute the next state from the previous boolean | Toggling a boolean in a handler |
| `hidden={!visible}` | Bind the HTML hidden state | Conditional display controlled by a component field |

Use React's setter rather than trying to assign to the `visible` constant. Keep the root layout server-side so its metadata export continues to work.

This is browser UI state, not persistent business data. Reloading the page resets it; it does not update `site.ts`, a Salesforce record, or a database.

## 11. Validate a change

For a small content change:

1. Save the file and inspect the development preview.
2. Check the affected section at desktop and mobile widths.
3. Check the relevant links or photo URLs.
4. Stop the development server before a production-build check to avoid two processes competing over `.next` output.
5. Run:

```powershell
npm.cmd run build
```

Optionally run `npm.cmd run lint` for the configured lint rules. Linting is separate from the build in this project.

To inspect production behavior after a successful build:

```powershell
npm.cmd start
```

Use the printed URL and stop the server with Ctrl+C afterward. Source edits require rebuilding before they appear in this production server.

A separate terminal can check the HTTP response:

```powershell
(Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing).StatusCode
```

`200` confirms that the server returned a response. It does not prove the design, links, spelling, or business prices are correct. Read the build output, inspect the actual page, and test the affected interaction.

The build checks compilation and TypeScript and creates production output. This project does not currently have `npm test`, Apex tests, a coverage gate, or an automated end-to-end test suite. Do not assume a successful build exercises a booking process.

## 12. Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| `npm.ps1` cannot run | PowerShell wrapper/execution policy | Try `npm.cmd`; keep organizational policy intact |
| `node` or `npm` is not recognized | Runtime not installed or not on PATH | Use your approved Node.js installation method, reopen the terminal, then check versions |
| Module/package not found | Dependencies are missing or an import is wrong | Confirm the project directory and path; install existing dependencies if needed |
| Cannot find `LayoutProps` or generated route declarations | Next.js types have not been generated | Start `npm.cmd run dev` or run a build; do not hand-edit `next-env.d.ts` |
| Type error on photo configuration | A required field is missing or has the wrong type | Match `DrinkPhoto`; use a string or `null` for `src` |
| List does not render after editing `.map()` | A callback with `{ ... }` forgot to return JSX | Add `return`, or use `(...)` for an implicit expression return |
| Duplicate key warning | Repeated category/name/label/cup count/key value | Make the list identity unique or introduce IDs |
| Photo is broken instead of a placeholder | `src` is nonempty but the file/URL is invalid | Verify the public path and filename; use `null` to show a placeholder |
| Photo works on Windows but fails after deployment | Filename case differs | Match the exact capitalization; other hosts may use case-sensitive filesystems |
| Page still shows old values under `npm start` | Production output was not rebuilt | Stop, build again, restart/redeploy |
| CSS change has no apparent effect | Another selector or later media query overrides it | Inspect computed styles in browser developer tools and the matching breakpoint |
| A new CSS class has no styling | Missing selector or mismatched `className` | Check spelling and which stylesheet is imported |
| `window`/`localStorage` or event handler error | Browser logic was added to a Server Component | Move that behavior into a focused Client Component |
| Build error mentioning `new Date()` or synchronous IO | Current-time code was added to a prerendered part under the installed caching rules | Keep deterministic content simple; consult installed Next.js caching docs for request-time/client alternatives |
| `EADDRINUSE` | The selected port is already occupied | Stop the server you own or use another port |
| `EACCES` while listening | A port, sandbox, or machine policy disallows the server | Use the permitted environment/approval process; do not assume the page code is broken |
| Font file missing during build | Local font path/file was removed | Restore the required font file or deliberately update the font declaration |

To use another local port, for example:

```powershell
npm.cmd run dev -- --port 3001
```

The extra `--` passes the following arguments through npm to the `next dev` command.

### Read errors by layer

| Layer | Example | First place to look |
| --- | --- | --- |
| Shell/runtime | Command not found; execution policy | Terminal/runtime setup |
| Dependency resolution | Cannot resolve a package | `package.json`, lockfile, installed dependencies |
| TypeScript | String passed where number expected | The named `.ts`/`.tsx` file and its types |
| Rendering/framework | Server/client boundary or prerender error | Component and installed Next.js docs |
| Asset request | HTTP 404 for a photo | Filename, `public/`, URL |
| Styling | Wrong spacing or mobile layout | Browser computed styles and `globals.css` |
| Business behavior | Wrong price or call destination | Source content and contact link values |

This is similar to distinguishing an Apex compile error, a failed callout, an LWC runtime error, and an incorrect business requirement instead of treating them as one problem.

## 13. Future Salesforce integration

There is no Salesforce integration in the current build. Adding one would be a separate feature, with authentication, authorization, input validation, and persistence decisions.

An illustrative future flow could be:

```text
Browser booking form
  -> server-side application endpoint
  -> validate request and use an authorized Salesforce integration
  -> create the intended Salesforce record
  -> return a user-facing success/error response
```

That flow does not exist simply because a React component has a typed object or a submit button. It would need an implemented and tested server path.

Keep credentials out of `site.ts`, `public/`, browser props/output, and `NEXT_PUBLIC_*` environment variables. A file being rendered on the server is not permission to display its secrets in the returned HTML. Prefer the integration and secret-management approach approved for your Salesforce org and hosting environment.

## 14. Practice and explain it back

Try these in a local development copy, restore confirmed business values afterward, and inspect the browser after each change:

| Exercise | Expected result | Concept learned |
| --- | --- | --- |
| Change one package's numeric price | Currency display changes in one row | Data-to-view flow and formatting |
| Add one unique flavor name | New item appears without changing JSX | Arrays, `.map()`, list identity |
| Set one real photo path, then return it to `null` | Image and placeholder alternate | Props, union type, conditional rendering |
| Change one root color token temporarily | Several related styles change | CSS variables and shared tokens |
| Add a verified Facebook URL | Fallback text becomes a link | Truthy/falsy values and ternary rendering |
| Inspect the page at 360, 700, and desktop widths | Layout follows the documented media rules | Responsive CSS and cascade |
| Build, start, edit source, then rebuild/restart | Production only updates after the new build | Source versus generated output |

For a handoff demonstration, trace one value through `site.ts` -> `Home` -> helper/component -> HTML -> CSS. Then explain which command prepares that output and which command serves it.
