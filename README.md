# My Portfolio

A responsive personal portfolio site built with plain HTML, CSS and JavaScript. It has no dependencies and no build step.

## How to view it
Double-click `index.html`, or open it in any browser.

## How to make it yours
| What | Where |
|---|---|
| Name, tagline, About text, skills, contact links | `index.html` (search for "Your Name" and `your-`) |
| Profile photo | Save it as `images/profile.jpg` |
| **Certificates** | Put the images in `certificates/`, then list them in `data.js` |
| Projects | `data.js` → `PROJECTS` |

### Adding a Coursera certificate
1. On Coursera, go to **Accomplishments**, open the certificate and click **Download**.
2. Save it as an image (JPG or PNG) in the `certificates/` folder, e.g. `certificates/python-for-everybody.jpg`.
   If you only have a PDF, take a screenshot of it or export it as an image.
3. Add an entry to `CERTIFICATES` in `data.js`:
   ```js
   {
     title: "Python for Everybody",
     issuer: "University of Michigan · Coursera",
     date: "Oct 2026",
     category: "Programming",
     image: "certificates/python-for-everybody.jpg",
     verify: "https://www.coursera.org/verify/ABC123XYZ"
   },
   ```
4. Delete the three `Example:` entries.

The certificate count in the About section and the filter buttons update on their own.

## Publish it for free (GitHub Pages)
1. Create a repository on GitHub (for example `portfolio`) and upload these files.
2. Open **Settings → Pages**, set **Source** to `Deploy from a branch`, choose `main` and `/ (root)`, then save.
3. Your site will be live at `https://<your-username>.github.io/portfolio/` within a minute or two.
