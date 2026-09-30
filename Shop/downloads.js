/* ==========================================================
   downloads.js  -  used ONLY by thanks.html (paid items).

   How it works:
   1. Make a long random key for each paid product. In your browser
      console (F12) run:   crypto.randomUUID()
   2. Paste it below as the key.
   3. In Stripe, set the Payment Link to redirect after payment to:
        https://YOURSITE.com/Shop/thanks.html?p=THE-RANDOM-KEY
   4. Upload the file with a random-looking name and put its path in "file".

   IMPORTANT: this is "hidden", not "locked". Anyone who has the
   thank-you link can download, and a determined person can find it
   in this file. See README.md for what that means and the safer options.
   ========================================================== */

window.DOWNLOADS = {
    /* Demo entry so you can test: open Shop/thanks.html?p=demo-key
       DELETE this block before you go live. */
    "demo-key": {
        title: "Sample Model Pack",
        file: "downloads/private/replace-me.zip",
        note: "Unzip it, then follow the setup guide inside."
    }

    /* Real entries look like this (remember the comma above):
    ,"PASTE-YOUR-RANDOM-KEY-HERE": {
        title: "My Product Name",
        file: "downloads/private/x8f2k1q9-my-product.zip",
        note: "Unzip it, then open README.txt."
    }
    */
};