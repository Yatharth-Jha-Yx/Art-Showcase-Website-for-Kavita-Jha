# Kavita Jha — Art Showcase website

A one-page website that shows your mom's artwork, organised into 12 "chapters"
(one per medium: Watercolour, Portraits, Terracotta, and so on). As you scroll,
the accent colour of the page slowly changes from one chapter to the next — so
scrolling feels like moving through her different styles.

Everything is built from the PDF booklet you gave me. All the artwork images,
titles, and sizes come straight from that file.

---

## What's inside this folder

| File / folder      | What it is                                                        |
|--------------------|-------------------------------------------------------------------|
| `index.html`       | The page itself (the structure: which image, which title, where). |
| `css/style.css`    | The looks (colours, fonts, spacing, the cursor, animations).      |
| `js/main.js`       | The behaviour (scrolling effects, the side rail, colour changes). |
| `images/`          | All 48 artwork photos, already shrunk so the site loads fast.     |
| `.nojekyll`        | A tiny empty file that tells GitHub "serve my files as they are". |
| `README.md`        | This guide.                                                       |

You don't need to install anything to look at it: just double-click
`index.html` and it opens in your web browser.

---

## How to put it online with GitHub Pages (free)

Think of GitHub Pages like this: GitHub already stores your files; Pages just
flips a switch so anyone with the link can see them as a real website. No server
to rent, no payment.

**Step 1 — Make a repository (a folder on GitHub).**
On github.com, click the **+** in the top-right → **New repository**.
Give it a name. A clean trick: name it `yourusername.github.io` — then your site
lives at `https://yourusername.github.io`. Any other name works too; the link
just becomes `https://yourusername.github.io/repo-name/`.

**Step 2 — Upload these files.**
Open the new repository → **Add file** → **Upload files**. Drag in everything
inside this folder: `index.html`, the `css` folder, the `js` folder, the
`images` folder, and `.nojekyll`. Then scroll down and click **Commit changes**.

> Important: upload the **contents** of this folder, not the folder itself.
> `index.html` must sit at the top level of the repository, not inside another
> folder — otherwise the link won't find it.

**Step 3 — Turn on Pages.**
In the repository, go to **Settings** (top menu) → **Pages** (left menu).
Under "Build and deployment", set **Source** to **Deploy from a branch**, pick
the **main** branch and the **/ (root)** folder, and click **Save**.

**Step 4 — Wait about a minute, then visit your link.**
Refresh that same Pages settings screen; it will show a green box with your live
web address. Open it. Done — the website is public.

If you change a file later, just upload the new version the same way and the live
site updates within a minute or so.

---

## Two small things you may want to rename

I named everything from the PDF, but a few pieces had no title printed, so I gave
them honest placeholder names. You can change these in about 30 seconds:

1. **Sand Art (Chapter VI)** — the booklet showed three sand pieces with no
   titles. I labelled them *The Sacred Couple*, *In Performance*, and
   *Moonlit Figure*. If your mom has the real names, swap them in.
2. **Abstract (Chapter VII)** — the third painting had no title in the PDF, so I
   marked it *Untitled*. Give it a name if there is one.

### How to rename a piece
Open `index.html` in any text editor (even Notepad). Press Ctrl+F, search for the
placeholder name (for example `Moonlit Figure`), type the real name over it, and
save. That's the only file you need to touch for titles.

Example — find this line:

```html
<figcaption><span class="t">Moonlit Figure</span> ...
```

and change `Moonlit Figure` to whatever the real title is.

---

## A quick word on what "scroll through time" became

You asked for a scrollbar that lets people "scroll through time". The PDF doesn't
have any dates on the artwork, so a real year-by-year timeline would have meant me
inventing dates — which would be wrong. Instead, the *journey* is through her
**mediums**: 12 numbered chapters, and the whole page (the side rail, the cursor,
the numbers, even the scrollbar colour) shifts hue as you move from one to the
next. If you ever get the actual years from her, it's easy to add them as small
labels under each chapter title.

---

*Site built from the Art Showcase Booklet PDF. Images, titles, and dimensions are
all taken directly from that document.*
