# Publishing Tio Philo with GitHub Pages

GitHub stores the source in a repository; GitHub Pages serves the generated website. These are separate steps. This project is prepared for both, but a local successful build does not establish that a remote repository exists or that the website is live.

## Initial publication

1. Authenticate the GitHub account that should own the site.
2. Create a **public** repository, normally `tio-philo-website`, with `main` as its default branch. If using an existing repository, review its contents and settings first.
3. Push the application source, assets, documentation, package files, and `.github/workflows/deploy-pages.yml`. Generated `node_modules/`, `.next/`, and `out/` directories stay excluded by `.gitignore`.
4. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
5. Open **Actions → Deploy Tio Philo to GitHub Pages**. A push to `main` triggers it automatically; it can also be started with **Run workflow** after Pages is configured.
6. Wait for both `build` and `deploy` to succeed. Use the actual URL returned by the deployment and verify the page, logo, fonts, flyer, and contact links.

For a project repository, the usual URL pattern is `https://ACCOUNT.github.io/REPOSITORY/`. This is a pattern, not a confirmed deployment address for this project. GitHub Pages settings and the successful deployment supply the real URL.

The account needs permission to create/push the repository and administer its Pages settings. A connected service must support the necessary write operations; a read-only connection cannot publish the site. Git and GitHub CLI were not installed in the inspected local environment, so authentication and an authorized publishing tool must be available before the source can be pushed from here.

## What the workflow does

| Step | Purpose | Salesforce comparison |
| --- | --- | --- |
| Checkout | Obtain the committed source | Retrieve the version of metadata/source to release |
| Setup Node | Provide Node.js 24 and npm caching | Prepare a build environment |
| Configure Pages | Obtain the site's URL prefix | Read target-environment deployment settings |
| `npm ci` | Install exactly the locked dependency tree | Prepare repeatable tooling dependencies |
| `npm run build:pages` | Generate static files in `out/` | Compile the release artifact |
| `npm run verify:pages` | Verify referenced files and repository-prefixed asset URLs | Validate the artifact before deployment |
| Upload artifact | Transfer the generated site to GitHub Actions storage | Stage a release artifact |
| Deploy Pages | Publish that artifact and return the live URL | Release to the public target environment |

The analogy describes the release process. This workflow does not deploy Salesforce metadata or run Apex tests.

The build job has read access to repository contents and Pages metadata. The deploy job has the Pages and identity-token permissions required for publishing. It uses GitHub's built-in workflow authentication; there is no personal token stored in the source or a custom repository secret required by this workflow.

## Two build profiles

| Profile | Command | Output/runtime |
| --- | --- | --- |
| Normal Next.js | `npm run dev`, or `npm run build` followed by `npm start` | Development preview or a Node.js-served production build in `.next/` |
| GitHub Pages | `npm run build:pages` | Static website in `out/`, served without Node.js on GitHub Pages |

`scripts/build-pages.mjs` sets `GITHUB_PAGES=true` for its child build process. In that profile, `next.config.ts` selects `output: "export"`, disables Cache Components/partial prerendering, uses trailing slashes, and serves images without Next.js's server image-optimization endpoint. The React Compiler and Tailwind build rules remain enabled.

The normal profile retains the previous Node.js runtime configuration. Do not use `npm start` to preview an exported `out/` directory; use a suitable static server if you need a static-file preview.

The Pages profile supports the current promotional site. If a future booking feature needs a database, server authentication, or a Next.js API handler, it will need a suitable backend/hosting arrangement; Pages will not execute a Node.js application for each request.

## Repository URL prefixes

Project sites often live under `/tio-philo-website`, whereas account sites or custom domains may have no prefix.

The workflow reads `steps.pages.outputs.base_path` and supplies it to both build and validation as `NEXT_PUBLIC_BASE_PATH`. Next.js uses the same value for `basePath`. The `publicAssetPath` helper prefixes public-file references, including the flyer, browser icon, and configured drink photos. The statically imported logo and compiled assets are handled by Next.js.

Continue storing photo paths as `/photos/coffee.jpg` and the flyer as `/brand/...`. Do not hard-code the repository prefix in `site.ts`; the helper applies it at build time.

To reproduce a project-prefix build in PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/tio-philo-website'
npm.cmd run build:pages
npm.cmd run verify:pages
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

Check both command results; stop and fix a failed build before relying on validation output. The verification command must receive the same prefix as the build. Run root-profile commands without that environment variable when testing the normal local URL.

`NEXT_PUBLIC_BASE_PATH` is public deployment configuration, not a credential. Its value is compiled into the build, so changing the repository/custom-domain path requires rebuilding.

## Asset verification

`scripts/verify-static-export.mjs` checks the actual generated HTML and CSS, not just source-code strings. It verifies that:

- `out/index.html` exists.
- Local `src`/`href` and CSS `url(...)` references resolve to files in the export.
- Root-relative references include the expected repository prefix.
- References cannot escape the export directory.
- The exported HTML does not require the Next.js image-optimization server.

It skips external URLs, fragments, telephone links, and data URLs. It does not prove visual appearance, external page availability, correct business prices, or that a GitHub deployment succeeded.

## Updating the live site later

Edit the normal source files, verify the change, and push a commit to `main`. The workflow builds and publishes that commit. Check the workflow result before announcing the update as live.

Do not edit the generated `out/` directory as your source of truth. It is regenerated from `src/` and `public/` on the next build.

## Official references

- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): repository and publishing-source setup.
- [Use custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): artifact/deployment workflow.
- [Installed Next.js static export guide](../node_modules/next/dist/docs/01-app/02-guides/static-exports.md): behavior matching the installed framework release.
- [Installed Next.js basePath guide](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/basePath.md): build-time URL prefixes.
