# Shop setup (no server needed)

## 1. Put the files on your site

Drop these next to your existing `style.css`:

- `shop.html`, `thanks.html`
- `shop.css`, `shop.js`
- `products.js`, `downloads.js`

`shop.css` loads after `style.css` and only adds things, so your other pages are untouched.
Edit the logo, nav links, and footer in `shop.html` and `thanks.html` so they match your other pages.

## 2. Add products

Open `products.js`, copy one product block, change the values. That's it.
Add images by putting them in a folder (for example `Assets/shop/`) and listing the paths in `images`.

## 3. Free items

Put the file in `downloads/` and set `file: "downloads/name.zip"` and `price: 0`.
Free files are public by design.

## 4. Paid items (Stripe Payment Links)

A parent or guardian owns the Stripe account, so do these steps together.

1. In the Stripe dashboard, create a Payment Link for the product.
2. Under "After payment", choose "Don't show confirmation page" and redirect to:
   `https://YOURSITE.com/thanks.html?p=RANDOM-KEY`
   (make `RANDOM-KEY` with `crypto.randomUUID()` in your browser console, F12)
3. Copy the payment link into that product's `buy` field in `products.js`.
4. Add the same `RANDOM-KEY` to `downloads.js` with the file path.
5. Upload the file with a random-looking name, for example `downloads/private/x8f2k1q9-pack.zip`.
6. Test with Stripe's test mode first (a test card like 4242 4242 4242 4242).

## The honest limit: hidden, not locked

Without a server, nothing can check that someone really paid before showing the download.
What this setup does:

- Buyers land on a page with a long random link that isn't listed anywhere on your site.
- The page is marked `noindex`, so search engines skip it.

What it can't stop:

- A buyer can share their thank-you link.
- Someone who opens `downloads.js` in their browser can read the file paths.

For low-priced items this is a common trade-off, but you should know it. Safer options, from easiest to hardest:

1. **Let a store host the download.** Payhip, Gumroad, or Ko-fi shop items deliver files only to buyers. Put their link in `buy` and skip `thanks.html` for those items. Check each one's age rules first.
2. **Stripe's confirmation message.** Payment Links can show a custom message after payment. If you put an unlisted download link only there (not in `downloads.js`), it never appears on your site. Check in the Stripe dashboard how links display in that message.
3. **Add a small backend later.** That's the only way to get truly private, expiring links.

## Things to update by hand

- `sold` counts (nothing can count them without a server)
- Refunds and questions come to you, so keep the contact page working

## Free hosting for a static site

GitHub Pages, Cloudflare Pages, and Netlify all host this for free, with your own domain.
Keep large files (over ~25 MB) out of the site itself; host them on a file service and link to them.
