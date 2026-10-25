# Tio Philo file and function reference

Use this reference while reading the actual code. For an introduction, see the [developer guide](DEVELOPER_GUIDE.md). For changes you can make yourself, see the [editing playbook](EDITING_PLAYBOOK.md).

This inventory covers authored source, configuration, assets, scripts, and documentation. `node_modules/` and `.next/` are explained as generated/vendor directories rather than documenting every third-party implementation file.

## 1. Project map

```text
tio-philo-website/
├── .github/workflows/deploy-pages.yml  Build/publish GitHub Pages
├── src/
│   ├── app/
│   │   ├── layout.tsx               HTML wrapper, fonts, metadata
│   │   ├── page.tsx                 Homepage and small local helpers
│   │   └── globals.css              Brand styles and responsive rules
│   ├── components/
│   │   ├── brand-logo.tsx           Uploaded logo component
│   │   ├── drink-line-art.tsx       Continuous SVG drink drawings
│   │   ├── photo-placeholder.tsx    Photo or empty-photo presentation
│   │   └── coffee-branch.tsx        Decorative SVG branch
│   ├── lib/
│   │   ├── site.ts                  Business data and DrinkPhoto type
│   │   └── paths.ts                 Public asset URL prefix helper
│   └── assets/fonts/
│       ├── eb-garamond-regular.ttf
│       ├── eb-garamond-semibold.ttf
│       ├── eb-garamond-italic.ttf
│       ├── inter-regular.ttf
│       ├── inter-semibold.ttf
│       ├── EB-Garamond-OFL.txt
│       └── Inter-OFL.txt
├── public/
│   ├── brand/
│   │   ├── tio-philo-emblem.png
│   │   ├── tio-philo-emblem-dark.jpg
│   │   ├── tio-philo-emblem-dark-transparent.png
│   │   ├── tio-philo-love-wall.png
│   │   ├── tio-philo-facebook-qr.svg
│   │   ├── tio-philo-facebook-qr.png
│   │   ├── tio-philo-flyer.png
│   │   └── tio-philo-flyer-v3.png
│   ├── photos/.gitkeep
│   ├── coffee-icon.svg
│   ├── file.svg                    Unused starter asset
│   ├── globe.svg                   Unused starter asset
│   ├── next.svg                    Unused starter asset
│   ├── vercel.svg                  Unused starter asset
│   └── window.svg                  Unused starter asset
├── scripts/
│   ├── prepare-brand-fonts.ps1
│   ├── build-pages.mjs
│   └── verify-static-export.mjs
├── docs/
│   ├── DEVELOPER_GUIDE.md
│   ├── FILE_REFERENCE.md
│   ├── EDITING_PLAYBOOK.md
│   ├── ASSET_NOTES.md
│   └── DEPLOYMENT.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── next-env.d.ts                   Generated type references
├── .gitignore
├── AGENTS.md
├── README.md
├── node_modules/                   Installed dependencies; generated
└── .next/                          Build/dev output; generated
```

`src/app/` is the routing directory. `src/components/`, `src/lib/`, and `src/assets/` are organizational choices in this project, not additional URL routes.

## 2. `src/lib/site.ts`: business content

**Inputs:** values written in this file. **Outputs:** named exports imported by the page, layout, and photo component. **Side effects:** none; there is no network request or database write.

Salesforce comparison: it serves a similar organizational purpose to Custom Metadata/configuration plus DTOs, but it is source code. An admin cannot update it in Salesforce Setup; changing it requires a source change and, in production, a new build/deployment.

### Exports

| Export | Shape | Used by | Purpose |
| --- | --- | --- | --- |
| `site` | Object | `page.tsx`, `layout.tsx` | Business identity, metadata, phone links, Facebook details, flyer URL |
| `verses` | Array of `{ text, reference, translation }` | `page.tsx` | Two quotations transcribed from the updated flyer |
| `flavors` | Array of category objects | `page.tsx` | Menu group titles and drink names |
| `packages` | Array of `{ cups, price }` | `page.tsx` | Six event-package rows |
| `addOns` | Array of `{ name, detail }` | `page.tsx` | Additional service/fee descriptions |
| `DrinkPhoto` | TypeScript type | `photo-placeholder.tsx`, this file | Required shape of a photo configuration |
| `drinkPhotos` | `DrinkPhoto[]` | `page.tsx` | Three configurable photo spaces |

### `site` fields

| Field | Meaning | Editing detail |
| --- | --- | --- |
| `name` | Full business name | Used in metadata, accessibility text, and footer; the visible header title is separately written in `page.tsx` |
| `tagline` | “Where Every Cup Brings Hearts Together.” | Displayed beside the hero logo and in the footer |
| `faithMessage` | “A cup of faith, a community of love.” | Heading above the two verses |
| `description` | Search/browser metadata description | Does not automatically replace the hero paragraph |
| `phones[].label` | Phone number displayed to people | Human-friendly formatting |
| `phones[].href` | `tel:` URL activated by a click | Uses an international number, such as `tel:+639764161770` |
| `facebookUrl` | Official Facebook link | Currently `https://www.facebook.com/tiophilo`; also used by the clickable QR card |
| `facebookName` | Facebook page name displayed in copy | Not a lookup or automatic page search |
| `facebookQr` | QR graphic URL | Direct-to-Facebook SVG; keep the encoded URL consistent with `facebookUrl` |
| `flyer` | Public flyer path | Used by the hero's “View our flyer” link |

### Collection fields

- A flavor group has `category` and `items`. `items` is an array of strings.
- A verse has `text`, `reference`, and `translation`. These are the flyer’s wording and attribution labels, displayed in a quotation with a caption; each reference is its React list key.
- A package has numeric `cups` and `price`. Store `6000`, not `"₱6,000"`.
- An add-on has string `name` and `detail`. Here `detail` is already display text, so it may contain `₱`, a unit, or words such as `Free`.
- A drink photo has string `label`, string `alt`, `src` that is either a string or `null`, and an `illustration` choosing `coffee`, `creamy`, or `refreshing`.

The current JSX uses these values as list keys: category, flavor name, cup count, add-on name, photo label, and phone URL. Avoid duplicate values within each list, or introduce separate unique IDs and update the corresponding `key` expressions.

### `DrinkPhoto` type and `DrinkPhoto[]`

```ts
export type DrinkPhoto = {
  label: string;
  alt: string;
  src: string | null;
  illustration: "coffee" | "creamy" | "refreshing";
};
```

`export const drinkPhotos: DrinkPhoto[] = [...]` tells TypeScript to check every entry against this shape. Missing `alt` or `src: 42` is a type error. A misspelled filename is still a valid string, so the type checker cannot detect that missing image.

## 3. `src/app/page.tsx`: homepage

**Inputs:** `BrandLogo`, `PhotoPlaceholder`, Next.js `Image`, the imported Love Wall illustration, six data exports from `site.ts`, and `publicAssetPath` from `paths.ts`. **Output:** the page at `/`. **Data writes/network calls:** none in this module.

Next.js recognizes `page.tsx` as a route file. The function name `Home` is descriptive; the filename and directory determine the URL.

### Functions

| Function | Inputs | Returns | Where used |
| --- | --- | --- | --- |
| `Arrow()` | None | A decorative `<span>` containing `↗` | Buttons, flyer link, phone links, optional Facebook link |
| `formatPrice(amount: number)` | One numeric price | A string such as `₱6,000` | Package table price cells |
| `Home()` | No declared props | A Fragment containing the entire homepage | Default export consumed by Next.js |

`Arrow` has `aria-hidden="true"` because the surrounding link text already conveys its purpose. It does not navigate or handle clicks itself.

`formatPrice` calls the built-in number method `toLocaleString("en-PH")`, then adds the peso symbol through a template string. It formats a display value; it does not calculate a package total, apply discounts, or convert currencies.

### The order of the rendered page

| Area | Key IDs/classes | Content/behavior |
| --- | --- | --- |
| Skip link | `href="#main"` | Keyboard shortcut to main content |
| Header | `.site-header`, `.wordmark` | Small logo, brand text, and section links |
| Hero | `id="home"`, `.hero` | Promotional headline, package link, updated flyer link, large logo, brand message |
| Service | `id="service"` | Event service copy, milk choices, hot/iced sizes |
| Flavors | `id="flavors"` | Menu categories and three photo components |
| Packages | `id="packages"` | Package table, add-ons, contact link |
| Love Wall | `.love-section` | Labeled card with a transparent illustration, plus bold complimentary Love Wall copy |
| Faith | `.faith-section`, `id="faith-heading"` | Community message and Isaiah/Romans quotations from the updated flyer |
| Contact | `id="contact"` | Booking instructions, two phone links, Facebook link, and clickable QR code |
| Footer | `.site-footer` | Copyright text, tagline, link back to hero |

The header and footer currently live in `page.tsx`, not the root layout. If you add a second page, they will not automatically appear there.

### All array-rendering callbacks

These are anonymous functions passed to `.map()`, not additional named exported methods.

| Expression | Callback parameter | Output per item | Key |
| --- | --- | --- | --- |
| `flavors.map(...)` | `group` | Category container | `group.category` |
| `group.items.map(...)` | `name` | One `<li>` drink name | `name` |
| `drinkPhotos.map(...)` | `photo` | One `PhotoPlaceholder` | `photo.label` |
| `packages.map(...)` | `item` | One table row | `item.cups` |
| `addOns.map(...)` | `item` | One term/description pair | `item.name` |
| `site.phones.map(...)` | `phone` | One clickable phone number | `phone.href` |
| `verses.map(...)` | `verse` | One figure containing a blockquote and reference caption | `verse.reference` |

The nested flavor mapping is the equivalent of an outer category loop containing an inner drink loop. The order of the data arrays determines the displayed order.

### Conditions and attributes

- `site.facebookUrl ? (...) : (...)` chooses a Facebook link or explanatory text. It is a rendering decision, not a permission check.
- `href="#contact"` scrolls to the HTML element with `id="contact"`. It is not a request to an API.
- `href={phone.href}` activates a device's telephone handler if supported; it does not send a text message automatically.
- `target="_blank"` requests a new browser context for the flyer/Facebook link. `rel="noopener noreferrer"` limits opener access and referrer information.
- `aria-labelledby="..."` associates a section with its heading ID. If you rename that heading's `id`, update the matching attribute.
- `scope="col"` and `scope="row"` identify table headers. The visually hidden caption gives the package table an accessible description.
- `<dl>`, `<dt>`, and `<dd>` express a description list, used here for add-on names and details.
- `<main id="main">` is the skip link's target; the outer `<>...</>` Fragment adds no extra DOM element.

## 4. `src/app/layout.tsx`: document wrapper, fonts, metadata

**Inputs:** `children` supplied by Next.js; `site`; five local font files. **Output:** the root HTML document layout. **Special exports:** `metadata` and a default `RootLayout` component.

Salesforce comparison: a shared outer page template plus some site-level head settings. It is not an Apex controller.

### Imports

| Import | Purpose |
| --- | --- |
| `Metadata` from `next` | Type checking for the metadata object; type-only import |
| `localFont` from `next/font/local` | Framework helper that prepares locally stored fonts |
| `site` | Supplies the title and description |
| `publicAssetPath` | Prefixes the favicon URL for a GitHub Pages project path |
| `./globals.css` | Loads application-wide styles |

### `localFont(...)` calls

The file calls this framework function twice at module level, once for each family. These are not network downloads.

| Value | Font files | CSS variable |
| --- | --- | --- |
| `garamond` | Regular 400, semibold 600, italic 400 | `--font-garamond` |
| `inter` | Regular 400, semibold 600 | `--font-inter` |

Each `src` entry specifies a path relative to `layout.tsx`, a weight, and a style. `display: "swap"` allows fallback text to display while the font is loading.

The helper returns generated class/variable information. `${garamond.variable} ${inter.variable}` adds the two returned class names to `<html>`. Those classes define the CSS custom properties referenced by `globals.css`.

### `metadata`

```ts
export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: publicAssetPath("/coffee-icon.svg") },
};
```

Next.js recognizes this export and creates head information. `Metadata` is a type, not a function called here. Changing the description updates metadata, not visible paragraphs.

### `RootLayout({ children }: LayoutProps<"/">)`

`children` is the page content inserted inside `<body>`. Think of it loosely as content passed into an outer template or an LWC slot. Next.js supplies it; `Home` does not pass it manually.

`LayoutProps<"/">` is a generated global Next.js helper type for the root route. It comes from framework-generated declarations, which is why there is no explicit import. `"/"` is a type argument identifying the route, not a function call.

`lang="en"` identifies the document language. Keep the root `<html>` and `<body>` structure intact.

## 5. `src/components/brand-logo.tsx`: uploaded logo

**Function:** `BrandLogo({ large = false }: { large?: boolean })`.

**Input:** optional boolean prop `large`. **Output:** a styled `<span>` wrapping Next.js's `<Image>`. **Side effects:** no file modification.

| Code | Explanation |
| --- | --- |
| `import emblem from "../../public/brand/tio-philo-emblem.png"` | Static image import; Next.js can obtain intrinsic image metadata |
| `large = false` | Default to the small header logo |
| `large?: boolean` | The caller may omit this input |
| `` `brand-logo${large ? " brand-logo-large" : ""}` `` | Always apply the base class and conditionally add the larger one |
| `src={large ? darkEmblem : emblem}` | Choose the supplied dark hero logo or the original header logo based on the boolean prop |
| `alt="..."` | Text alternative identifying the logo |
| `sizes={large ? ... : ...}` | Suggest display widths to help the browser choose an image resource |
| `preload={large}` | Request early loading for the large hero logo |

`sizes` does not directly set the visible size. CSS does. These hints are approximate; if the layout changes significantly, review them for efficient loading.

The header PNG includes wide surrounding margins; CSS frames it and uses brightness/multiply blending. The hero imports `tio-philo-emblem-dark-transparent.png` with transparent regions outside and inside the dark badge. It has its own aspect ratio and framing, normal blending, and no brightness filter. The original dark JPG is retained as a reference. A replacement logo with different margins may need different CSS framing.

## 6. `src/components/photo-placeholder.tsx`: photo or placeholder

**Function:** `PhotoPlaceholder({ photo }: { photo: DrinkPhoto })`.

**Input:** a required `photo` object matching the imported `DrinkPhoto` type. **Output:** a `<figure>` containing an image/placeholder and caption. **Data writes:** none.

The file imports `DrinkPhoto` with `import type`, so that import is used by TypeScript checking rather than adding runtime data.

### Image branch

When `photo.src` is truthy:

- `src={publicAssetPath(photo.src)}` selects the photo URL with the deployment prefix when needed.
- `alt={photo.alt}` supplies the alternative text.
- `fill` makes the image occupy its parent frame. `.photo-frame` therefore has `position: relative` and a defined aspect ratio.
- `sizes` provides approximate responsive width hints. It does not replace the CSS layout rules.
- `.photo-frame img { object-fit: cover; }` fills the frame while allowing visual cropping.

### Placeholder branch

When `photo.src` is `null` or an empty string, `DrinkLineArt` and “Drink photo coming soon” text are rendered. `photo.illustration` selects the coffee, creamy, or refreshing drawing. The SVG is decorative, so `aria-hidden="true"` hides it from assistive technology.

`<figcaption>{photo.label}</figcaption>` is rendered in both branches. You do not need to change the component to replace a placeholder: update `drinkPhotos` in `site.ts`.

### `src/components/drink-line-art.tsx`: drink drawings

**Function:** `DrinkLineArt({ kind }: { kind: DrinkPhoto["illustration"] })`. It returns one decorative SVG with a single continuous `<path>`. It runs as part of server rendering, with no browser event handlers or data writes.

`DrinkPhoto["illustration"]` is an indexed-access type: reuse the allowed values of that property rather than repeat them in another type. `Record<DrinkPhoto["illustration"], string>` requires `drinkPaths` to have a path string for every allowed drink kind. `drinkPaths[kind]` selects the path, like a typed Apex Map lookup. `currentColor`, rounded line ends, and stroke width are controlled in CSS.

## 7. `src/components/coffee-branch.tsx`: decorative vector

**Function:** `CoffeeBranch()`. **Inputs:** none. **Output:** an inline SVG branch. The user removed its import and tag from the homepage; this component remains available for reuse.

| SVG item | Meaning |
| --- | --- |
| `viewBox="0 0 200 220"` | Internal coordinate system |
| `fill="none"` | Draw outlines rather than filled shapes |
| `<g>` | Group shapes sharing stroke settings |
| `stroke="currentColor"` | Inherit the CSS text color |
| `strokeWidth`, `strokeLinecap`, `strokeLinejoin` | JSX versions of SVG stroke attributes |
| `<path d="...">` | Drawing instructions: moves, lines, curves, and closed outlines |
| `<circle cx="..." cy="..." r="...">` | Draw a circle from a center point and radius |
| `aria-hidden="true"` | Exclude the decoration from the accessible reading order |

The geometry is drawing data, not business logic. CSS controls its position, width, opacity, and color. There is no need to understand every path coordinate to maintain menu or pricing content.

## 8. `src/app/globals.css`: style reference

This is a global stylesheet. It contains no TypeScript functions. Selectors match HTML elements/classes and CSS declarations change their presentation.

### Setup, tokens, and selectors

| Rule | Purpose |
| --- | --- |
| `@import "tailwindcss"` | Include Tailwind's styling framework |
| `:root` | Define shared brand colors |
| `@theme inline` | Expose colors and font variables to Tailwind's theme system |
| `* { box-sizing: border-box; }` | Include padding/borders in declared box sizes |
| `html` | Smooth anchor scrolling and spacing above scroll targets |
| `body` | Background, text color, body font, base margins |
| `a`, `a:focus-visible` | Link defaults and visible keyboard focus |
| `::selection` | Selected-text colors |
| `h1, h2, h3, p`, `em` | Normalize margins and apply heading/emphasis treatment |

| Custom property | Current value | Purpose |
| --- | --- | --- |
| `--background` | `#f8f0e1` | Ivory page background |
| `--foreground` | `#4d2c1a` | Main dark brown, including contact background |
| `--accent` | `#744a2d` | Lighter brown emphasis and hover states |
| `--muted` | `#77614e` | Supporting text |
| `--line` | `#d8c6ad` | Borders and dividers |
| `--panel` | `#efe2cd` | Package-section background |
| `--text-body` | `1rem` | Main copy: 16px at the default browser font size |
| `--text-small` | `.875rem` | Most secondary copy, links, and notes: 14px by default |
| `--text-label` | `.75rem` | Small section labels: 12px by default |
| `--font-garamond` / `--font-inter` | Generated by `localFont` | Actual loaded font families |

Some decorative shades are literal colors in later rules. Changing one root token does not recolor every decorative detail.

### Selector groups by visible feature

| Selectors | Responsibility |
| --- | --- |
| `.wrap` | Center content, cap desktop width, set side gutters |
| `.skip-link`, `.skip-link:focus` | Reveal keyboard skip link when focused |
| `.visually-hidden` | Keep accessible table description without visual layout space |
| `.brand-logo`, `.brand-logo img`, `.brand-logo-large` | Logo viewport, image framing, large variant |
| `.site-header`, `.site-header nav`, nav child rules | Header alignment, navigation spacing and links |
| `.wordmark`, `.wordmark-caption` | Brand title and smaller subtitle |
| `.nav-book` | Header booking link's outlined presentation |
| `.hero`, `.hero-copy`, `h1`, `h1 em` | Hero layout and headline; `.hero-copy` is a markup hook without a dedicated base rule |
| `.eyebrow` | Small, letter-spaced section labels |
| `.hero-description`, `.hero-actions` | Supporting copy and actions |
| `.button`, `.button:hover`, `.button span` | Filled links that look like buttons |
| `.text-link`, `.text-link span` | Secondary flyer link |
| `.hero-emblem`, child paragraph/logo rules | Hero logo and tagline; isolated stacking context |
| `.coffee-branch` | Decorative branch size/position, color, opacity, layering |
| `.service-section`, `.service-copy`, `.service-details` | Service columns, paragraphs, drink-size/milk details |
| `h2`, `h2 em`, `.section-space` | Section typography and vertical spacing |
| `.section-heading-inline`, direct-child paragraph rule | Side-by-side headings and introductory text |
| `.flavor-lists`, `.flavor-group`, child rules | Two menu columns, divider, headings, drink names, dot markers |
| `.photo-gallery` | Three photo columns |
| `.drink-photo`, `figcaption`, `:nth-child(...)` rules | Photo blocks, captions, alternate placeholder backgrounds |
| `.photo-frame`, `.photo-frame img` | Frame dimensions and image crop behavior |
| `.photo-placeholder`, `.drink-line-art`, span rules | Empty-photo frame, continuous drink illustration, and label |
| `.packages-section`, `.package-layout` | Dark brown section, scoped cream/gold color variables, and pricing/add-on columns |
| `.package-table`, descendant header/cell/span rules | Price alignment, borders, numeric appearance |
| `.package-extras`, descendant heading/list/button rules | Add-on details and event-planning link |
| `.package-note` | Supporting transportation note |
| `.love-section`, `.love-note` | Love Wall columns and decorative note frame |
| `.love-note h3`, `.love-note img`, `.love-note > p`, `.note-signature` | Love Wall title, responsive illustration, note lettering, keepsake caption |
| `.love-copy` paragraph rule | Love Wall explanation text |
| `.faith-section`, `.faith-inner`, `.faith-heart` | Tinted faith section, spacing, and decorative heart |
| `.verse-grid`, `.verse`, blockquote/caption/cite rules | Responsive verse columns, quotation text, dividers, and references |
| `.contact-section`, `.contact-inner`, descendants | Dark contact area, responsive columns, heading and copy colors |
| `.phone-link`, hover/span rules | Phone-number links and arrow sizing |
| `.facebook-label`, `.facebook-link`, strong rule | Facebook fallback text or link |
| `.facebook-qr` and child rules | Clickable QR card with white-backed code, explanatory text, and mobile sizing |
| `.contact-location` | Cavite transportation note |
| `.site-footer`, child rules | Footer alignment, tagline, and back-to-top link |

Some section/heading classes in JSX are semantic hooks without standalone styling rules; their appearance comes from shared selectors. A class need not have its own CSS declaration to be valid markup.

### Reading less familiar selectors

| Selector | Meaning in this stylesheet |
| --- | --- |
| `.brand-logo img` | Any image inside a logo container |
| `.site-header nav > a` | Links directly inside the header navigation |
| `.service-copy > p + p` | A paragraph directly following another paragraph |
| `.flavor-group + .flavor-group` | A flavor group immediately after another flavor group |
| `.love-copy > p:not(.eyebrow)` | Direct paragraph children except the eyebrow label |
| `.drink-photo:nth-child(2)` | The second photo block |
| `.package-table th:last-child` | The final header cell among its siblings |
| `.hero-emblem > p` | Direct paragraph children of the hero emblem |
| `li::before` | A generated decorative marker before list-item content |

### Responsive overrides

The base styles are followed by overrides. If more than one rule matches, CSS cascade/specificity and source order determine the result.

| Condition | Main changes |
| --- | --- |
| `max-width: 1000px` | Narrower gutters, tighter gaps, smaller logo/headline |
| `max-width: 700px` | Stacked hero/service/flavors/photos/packages/Love Wall/verses/contact; navigation in two columns; readable body type and landscape photo frames |
| `max-width: 360px` | Tighter navigation/menu spacing and a single-column photo gallery |
| `prefers-reduced-motion: reduce` | Disable smooth scrolling and transitions |

At 700 CSS pixels or narrower, the photo gallery, flavor groups, and verses each use a single column. Navigation uses two columns with links at least 44px tall. The rem-based text tokens keep the smaller copy readable rather than shrinking it at mobile breakpoints.

The HTML's approximate `Image sizes` hints are not a source of truth for these breakpoints; this stylesheet determines actual layout.

## 9. `package.json`: dependencies and commands

This JSON file is the project's npm manifest. JSON requires double-quoted strings and does not allow comments or trailing commas.

| Field | Current purpose |
| --- | --- |
| `name` | npm/project identifier |
| `version` | Application package version `0.1.0`; not the Next.js version |
| `private: true` | Prevent accidental publication as an npm package; does not make a deployed website private |
| `scripts` | Named terminal commands: `dev`, `build`, `build:pages`, `verify:pages`, `start`, `lint` |
| `dependencies` | Main framework/runtime libraries |
| `devDependencies` | Build, type-checking, and development tooling |

### Direct dependency inventory

| Package | Role in this build |
| --- | --- |
| `next` | Framework, router, server/build commands, image and font helpers |
| `react` | Component/rendering model |
| `react-dom` | React's DOM rendering integration |
| `@tailwindcss/turbopack` | CSS loader configured in the project's Turbopack rules |
| `tailwindcss` | Processes the Tailwind stylesheet import/theme directives |
| `typescript` | TypeScript checking/tooling |
| `@types/node` | Node API type declarations; not the installed Node runtime version |
| `@types/react`, `@types/react-dom` | React/DOM type declarations |
| `babel-plugin-react-compiler` | React Compiler integration used by the Next.js configuration |
| `eslint` | Static code analyzer |
| `eslint-config-next` | Next.js lint rules, including TypeScript and performance-related presets |

`devDependencies` still matter when building the website. Installing only production dependencies on a machine that must compile the source can omit required build tools.

## 10. `package-lock.json`: reproducible dependency resolution

Generated/maintained by npm. It records resolved direct and transitive package versions, download locations, and integrity information.

- `lockfileVersion: 3` describes the lockfile format.
- `packages[""]` represents this root project's package information.
- Other `packages[...]` entries describe installed/resolved dependency packages.
- `version` is the resolved package version.
- `resolved` identifies where the package comes from when present.
- `integrity` is package integrity information, not an application credential.

Use npm to update it; do not hand-edit a transitive dependency entry to fix an application bug. Keep it with the project source when using Git. It helps reproduce installations, but is not a replacement for the application source or an uploaded deployment archive.

## 11. `next.config.ts`: Next.js behavior

`const nextConfig: NextConfig = { ... }` creates a typed configuration object; `export default nextConfig` gives it to Next.js. The file contains configuration, not a custom function/method.

| Setting | Meaning in this installed release | Effect on this particular site |
| --- | --- | --- |
| `output` | `"export"` when `GITHUB_PAGES=true`, otherwise the normal Next.js mode | Produces a static `out/` directory for GitHub Pages |
| `basePath` | Build-time `NEXT_PUBLIC_BASE_PATH`, or an empty string | Prefixes framework URLs for repository hosting |
| `trailingSlash` | Enabled in the Pages profile | Emit directory-style static routes |
| `cacheComponents` | Enabled normally, disabled for static export | Normal profile supports the configured prerendering/caching model; Pages has no Node.js request runtime |
| `partialPrefetching` | Enabled normally, disabled for static export | Minimal direct impact on the current plain `#section` anchors |
| `images.unoptimized` | Enabled in the Pages profile | Avoid requiring Next.js's image-optimization server |
| `reactCompiler: true` | Enables compiler-assisted React rendering optimizations | Handled by tooling; no manual memoization is required for these simple components |
| `turbopack.rules["*.css"]` | Run matching CSS through the configured Tailwind loader | Processes `globals.css` and its Tailwind directives |
| `as: "*.css"` | Tells the rule to treat its result as CSS | Keeps the stylesheet in the CSS processing path |

The rule's `"*.css"` is a build-tool filename pattern, not a CSS selector.

Version-specific installed references: [Cache Components](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md), [Partial Prefetching](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/partialPrefetching.md), and [React Compiler](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md).

Do not replace this configuration with an older tutorial's `experimental.ppr` or assume older cache defaults apply. If adding current-time or random values to prerendered markup, check the installed caching guide; a direct `new Date()` in the page previously caused a production build error in this configuration.

## 12. `tsconfig.json`: TypeScript rules

This file configures checking and module interpretation. It does not run your application.

| Option | Explanation |
| --- | --- |
| `target: "ES2017"` | Sets TypeScript's JavaScript language target expectations; Next.js also has its own compilation/browser pipeline |
| `lib: [...]` | Provide declarations for DOM APIs, iterable DOM collections, and newer JavaScript APIs; declarations do not supply missing runtime polyfills |
| `allowJs: true` | Allow JavaScript files in the project; does not by itself enable full checking of every JS file |
| `skipLibCheck: true` | Skip detailed checking inside library declaration files; application code is still checked |
| `strict: true` | Enable stricter checking, including null-related checks |
| `noEmit: true` | TypeScript does checking without writing JavaScript output; Next.js handles the build output |
| `esModuleInterop: true` | Support certain CommonJS/ES-module interoperability patterns |
| `module: "esnext"` | Use modern module syntax in the toolchain |
| `moduleResolution: "bundler"` | Resolve imports using bundler-compatible rules |
| `resolveJsonModule: true` | Allow typed JSON imports |
| `isolatedModules: true` | Require code compatible with per-file transformation |
| `jsx: "react-jsx"` | Configure JSX handling for the modern React transform |
| `incremental: true` | Allow cached type-checking information for faster repeated work |
| `plugins: [{ name: "next" }]` | Enable Next.js TypeScript tooling support |
| `paths: { "@/*": ["./src/*"] }` | Resolve `@/` imports into the `src/` folder |
| `include` | Source/type patterns TypeScript should consider, including generated route declarations |
| `exclude: ["node_modules"]` | Avoid treating installed packages as ordinary application source roots; imported package declarations can still be used |

Do not turn off `strict` simply to silence a type error; fix the object or function signature first.

## 13. `eslint.config.mjs`: lint rules

`.mjs` explicitly denotes a JavaScript ES module. This file imports framework/library functions rather than declaring custom methods.

| Expression | What it does |
| --- | --- |
| `defineConfig([...])` | Build the exported ESLint configuration |
| `...nextVitals` | Spread the imported Next.js performance/framework preset entries into the array |
| `...nextTs` | Add Next.js TypeScript preset entries |
| `globalIgnores([...])` | Ignore generated `.next`, `out`, `build`, and `next-env.d.ts` paths |
| `export default eslintConfig` | Expose the resulting configuration to ESLint |

The spread operator `...` inserts array entries here; it is not an Apex access modifier. Linting is separate from `npm run build` in the scripts configured for this project.

## 14. `next-env.d.ts`: generated framework types

The `.d.ts` suffix means a declaration file: type information rather than executable application logic.

- Triple-slash `reference types` directives load Next.js and image type declarations.
- Imports from `.next/types/routes.d.ts` and `.next/types/root-params.d.ts` connect generated route information.
- The file explicitly says not to edit it.
- `next dev`, `next build`, or the relevant framework type-generation command can refresh generated declarations.

If an editor reports missing route/type helpers after a fresh checkout, run the development server or build before editing these declarations by hand.

## 15. `.gitignore`, `AGENTS.md`, and `README.md`

| File | Purpose | Salesforce comparison |
| --- | --- | --- |
| `.gitignore` | Tell Git which untracked generated/local files to ignore | A source-control concern; distinct from `.forceignore` and metadata deployment filtering |
| `AGENTS.md` | Repository instructions for coding assistants, including consulting installed Next.js docs | Team working conventions, not executable website code |
| `README.md` | Quick setup, customization, assets, and links to these guides | A project's handoff/readme document |

The ignore file includes dependencies, `.next`, other build outputs, coverage, logs, environment files, local Vercel state, TypeScript build caches, and `next-env.d.ts`. Negative patterns beginning with `!` keep selected Yarn support paths eligible for tracking.

Ignoring a file does not delete it, stop a running process, or remove it from Git if it was already tracked. This project now has a Git repository and a public GitHub remote; `.gitignore` controls which new files are eligible for tracking.

## 16. `scripts/prepare-brand-fonts.ps1`: optional font download helper

This is **PowerShell**, not Node.js or TypeScript. It runs only when someone executes it. Normal site builds use the already-present local font files and do not run this script.

It declares no custom functions. Its commands work in sequence:

| Line/command | Role |
| --- | --- |
| `$ErrorActionPreference = 'Stop'` | Stop execution on errors instead of continuing with partial output |
| `$PSScriptRoot` | Directory containing this script, regardless of the terminal's current location |
| `Join-Path` | Construct a destination path safely from directory/path pieces |
| `New-Item ... -Force` | Ensure the destination font directory exists |
| `Out-Null` | Suppress routine directory-creation output |
| `$files = @{ ... }` | Map destination filenames to font/license download URLs |
| `$files.GetEnumerator()` | Iterate the hashtable entries; ordering is not a contract |
| `foreach (...)` | Download each entry in turn |
| `Invoke-WebRequest ... -OutFile ...` | Save the remote font/license to the destination file |
| `Write-Output` | Print the saved filename |

**Side effects:** requires internet access and writes/overwrites five font files and two license files under `src/assets/fonts`. It does not install Node.js, run npm, modify the flyer, or upload anything. The URLs are pinned asset locations and may need future maintenance if the provider changes them.

## 17. Public assets

| File | Used by | Function |
| --- | --- | --- |
| `public/brand/tio-philo-emblem.png` | `BrandLogo` static import | The uploaded 1102 × 1427 logo image, unchanged |
| `public/brand/tio-philo-emblem-dark.jpg` | Reference only | The uploaded 1578 × 2028 dark/reverse logo, unchanged |
| `public/brand/tio-philo-emblem-dark-transparent.png` | Large `BrandLogo` variant | 1350 × 1165 dark logo with transparent outside and interior light areas; see [asset notes](ASSET_NOTES.md) |
| `public/brand/tio-philo-love-wall.png` | Homepage static image import | 1340 × 1174 transparent illustration adapted from the supplied Love Wall graphic; see [asset notes](ASSET_NOTES.md) |
| `public/brand/tio-philo-facebook-qr.svg` | `site.facebookQr` | Functional QR generated for the confirmed Facebook URL; use a QR encoder to change its destination |
| `public/brand/tio-philo-facebook-qr.png` | Reference only | Supplied QR screenshot, unchanged; encodes an intermediary QR-service address |
| `public/brand/tio-philo-flyer.png` | Earlier reference | The earlier uploaded 1122 × 1402 promotional flyer, unchanged |
| `public/brand/tio-philo-flyer-v3.png` | `site.flyer` URL | The updated 1055 × 1491 flyer with the brand message and verses, unchanged |
| `public/coffee-icon.svg` | Root metadata | Small coffee-cup browser icon in brand colors |
| `public/photos/.gitkeep` | No runtime code | Convention for keeping an otherwise empty photo folder in Git; not a special Next.js file |
| `public/file.svg` | No current reference | Unused create-next-app starter icon |
| `public/globe.svg` | No current reference | Unused create-next-app starter icon |
| `public/next.svg` | No current reference | Unused create-next-app starter logo |
| `public/vercel.svg` | No current reference | Unused create-next-app starter logo |
| `public/window.svg` | No current reference | Unused create-next-app starter icon |

The unused assets do not appear on the page. They remain public files; they are not hidden simply because the homepage does not use them.

`coffee-icon.svg` is a standalone SVG file with a root coordinate system, rounded background rectangle, cup outline/fill, handle, and steam paths. Unlike `CoffeeBranch`, it is not a React function. `xmlns` identifies the SVG namespace. Its colors can be edited as text.

## 18. Local font assets and licenses

| File | Typeface/style | Consumer |
| --- | --- | --- |
| `eb-garamond-regular.ttf` | EB Garamond, normal 400 | `garamond` font declaration |
| `eb-garamond-semibold.ttf` | EB Garamond, normal 600 | `garamond` font declaration |
| `eb-garamond-italic.ttf` | EB Garamond, italic 400 | `garamond` font declaration |
| `inter-regular.ttf` | Inter, normal 400 | `inter` font declaration |
| `inter-semibold.ttf` | Inter, normal 600 | `inter` font declaration |
| `EB-Garamond-OFL.txt` | Bundled EB Garamond license | Retained with font distribution |
| `Inter-OFL.txt` | Bundled Inter license | Retained with font distribution |

TTF files are binary font assets, not code to edit manually. Keep the accompanying license files with the project when distributing the fonts.

## 19. Generated directories and optional future files

| Path | What it is | How to treat it |
| --- | --- | --- |
| `node_modules/` | Installed packages, including Next.js's version-matched docs | Read when needed; do not implement site changes by editing dependency code |
| `.next/` | Compiled page output, generated types/assets, and development/build caches | Generated; do not hand-edit as the source of a fix |
| `*.tsbuildinfo`, if created | TypeScript incremental checking cache | Generated; not business data |
| `.env.local`, if added later | Local environment configuration | Not currently required; public-prefixed values are not secrets |

This repository does not currently contain a custom `route.ts` API, an application database client, Salesforce authentication configuration, a booking persistence layer, or a dedicated automated test suite. The `/_not-found` output seen in a build comes from framework behavior; there is no authored `not-found.tsx` in this project.

## 20. Documentation files

| File | Purpose |
| --- | --- |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Stack concepts, Salesforce comparisons, syntax, and rendering flow |
| [FILE_REFERENCE.md](FILE_REFERENCE.md) | This complete source/configuration/asset and function reference |
| [EDITING_PLAYBOOK.md](EDITING_PLAYBOOK.md) | Commands, editing recipes, validation, troubleshooting, and learning exercises |
| [DEPLOYMENT.md](DEPLOYMENT.md) | GitHub Pages setup, static/server build profiles, URL prefixes, and publishing workflow |

These Markdown files are for maintainers. They are not website routes or customer-facing page content. Update them when changing architecture, adding a feature, or moving a file.

## 21. GitHub Pages support files

### `src/lib/paths.ts`

`publicAssetPath(path: string)` adds the build-time `NEXT_PUBLIC_BASE_PATH` to root-relative public asset paths. A trailing slash is removed from the configured prefix. External URLs, protocol-relative URLs, and non-root-relative paths are returned unchanged.

Examples: with prefix `/tio-philo-website`, `/brand/image.png` becomes `/tio-philo-website/brand/image.png`; with an empty prefix, it stays `/brand/image.png`. The page uses it for the flyer, the layout for the favicon, and the photo component for configured photos. Keep content paths free of the repository prefix to avoid adding it twice.

### `scripts/build-pages.mjs`

A Node.js ES-module script. `createRequire(import.meta.url)` provides package resolution from this module, `require.resolve` locates the installed Next.js CLI, and `spawnSync` runs it with the current Node executable. The child receives the existing environment plus `GITHUB_PAGES=true`; inherited terminal output shows the normal build logs. An error is thrown if spawning fails, and `process.exit` returns the child's result to npm/CI.

It performs a real static build; it does not create a repository, authenticate, or publish anything by itself.

### `scripts/verify-static-export.mjs`

| Function/API | Purpose |
| --- | --- |
| `walk(directory)` | Recursively list exported files using `readdirSync` and `statSync` |
| `verifyAsset(reference, sourceFile)` | Ignore external/fragment references, resolve local file URLs, check the expected prefix and export boundary, and collect missing-file errors |
| `readFileSync` / `existsSync` | Read generated HTML/CSS and check files |
| `matchAll` | Iterate HTML asset attributes and CSS URL references |
| `path.resolve`, `path.relative`, `path.dirname` | Resolve paths relative to the export or originating stylesheet/page |
| `process.exit(1)` | Fail validation so CI does not publish a broken artifact |

The script requires a successful static build and the same base-path environment value used for that build. It checks generated file references, not browser rendering or external phone/Facebook services.

### `.github/workflows/deploy-pages.yml`

GitHub Actions reads this YAML file. A push to `main` or a manual dispatch starts the workflow. The `build` job checks out code, prepares Node.js 24, obtains Pages metadata, installs locked dependencies, builds/verifies `out/`, and uploads it. The `deploy` job depends on a successful build and publishes the uploaded artifact to the `github-pages` environment.

The workflow reads `${{ steps.pages.outputs.base_path }}` for the repository URL prefix and publishes `${{ steps.deployment.outputs.page_url }}` as its environment URL. These are GitHub Actions expressions, not JavaScript template strings. No personal token is hard-coded. Repository creation, authenticated source upload, and enabling Pages are separate initial setup steps described in [DEPLOYMENT.md](DEPLOYMENT.md).
