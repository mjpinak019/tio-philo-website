# Publishing Tio Philo with GitHub Pages

GitHub stores the source in a repository; GitHub Pages serves the generated website. This project is published with both:

- **Public website:** https://tiophilo.site/
- **Public repository:** https://github.com/mjpinak019/tio-philo-website
- **Deployment history:** [Deploy Tio Philo to GitHub Pages](https://github.com/mjpinak019/tio-philo-website/actions/workflows/deploy-pages.yml)

Initial publication used Git and Git Credential Manager to authenticate and push the source. GitHub Pages uses the **GitHub Actions** publishing source. The first build and deployment completed successfully. For subsequent changes, check the matching commit's workflow result; a successful local build alone does not publish an update.

## Initial publication

These setup steps are already complete for this repository. Keep them as a reference if you publish a separate copy later.

1. Authenticate the GitHub account that should own the site.
2. Create a **public** repository, normally `tio-philo-website`, with `main` as its default branch. If using an existing repository, review its contents and settings first.
3. Push the application source, assets, documentation, package files, and `.github/workflows/deploy-pages.yml`. Generated `node_modules/`, `.next/`, and `out/` directories stay excluded by `.gitignore`.
4. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
5. Open **Actions → Deploy Tio Philo to GitHub Pages**. A push to `main` triggers it automatically; it can also be started with **Run workflow** after Pages is configured.
6. Wait for both `build` and `deploy` to succeed. Use the actual URL returned by the deployment and verify the page, logo, fonts, flyer, and contact links.

For a project repository, the usual URL pattern is `https://ACCOUNT.github.io/REPOSITORY/`. The original address was `https://mjpinak019.github.io/tio-philo-website/`. GitHub Pages now has the custom domain `tiophilo.site`, which serves the website directly at its root.

The account needs permission to create/push the repository and administer its Pages settings. Git is installed and Git Credential Manager handles local GitHub authentication. GitHub CLI (`gh`) is optional and was not required for this publication. Credentials are not stored in project source files.

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

### Custom domain: tiophilo.site

The custom domain uses an empty `basePath`. The existing workflow obtains this value from GitHub Pages automatically; no domain needs to be hard-coded in the application.

Changing **Settings → Pages → Custom domain** does not rewrite an already generated Next.js build. After changing the domain, open **Actions → Deploy Tio Philo to GitHub Pages → Run workflow**, choose `main`, and wait for the build and deployment to finish. A normal push to `main` also triggers the rebuild.

The initial domain switch showed HTML but missing styling and images because the old build still requested `/tio-philo-website/_next/...`, which returned 404. On the custom domain, the correct path is `/_next/...`. Rebuilding with the domain's current configuration fixes these compiled references, including the logo, fonts, and flyer.

In Salesforce terms, updating the domain is like changing the site's address; the generated website is still a previously built release artifact. The deployment pipeline must produce a new artifact containing the correct resource URLs.

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

For example, after editing the menu in `src/lib/site.ts`:

```powershell
npm.cmd run lint
npm.cmd run build:pages
npm.cmd run verify:pages
git diff
git add src/lib/site.ts
git commit -m "Update coffee menu"
git push origin main
```

Check each command's result before moving to the next. Stage the specific files you changed; the `git add` example only includes the menu data file. GitHub rebuilds with the correct repository URL prefix. Open the deployment history link above and wait for both jobs to succeed, then check the public site.

In Salesforce terms, saving a file is like editing your local LWC source, committing records a version, and pushing sends it to the shared repository. GitHub Actions then builds and deploys the website, similar to an automated release pipeline. A local save alone does not change the public site.

Do not edit the generated `out/` directory as your source of truth. It is regenerated from `src/` and `public/` on the next build.

## Official references

- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): repository and publishing-source setup.
- [Use custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): artifact/deployment workflow.
- [Installed Next.js static export guide](../node_modules/next/dist/docs/01-app/02-guides/static-exports.md): behavior matching the installed framework release.
- [Installed Next.js basePath guide](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/basePath.md): build-time URL prefixes.
