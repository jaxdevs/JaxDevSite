/* ==========================================================
   products.js  -  this is the only file you edit to add items.
   Copy one product block, paste it, change the values.
   ========================================================== */

window.SHOP_CONFIG = {
    currency: "USD",
    contactUrl: "../support.html"
};

/*
  FIELDS
  slug         short unique id, lowercase, no spaces (used in the page link)
  title        product name
  blurb        one short line shown on the card
  description  list of paragraphs shown in the popup
  category     what filter button it appears under
  price        number in dollars. Use 0 for free.
  images       list of image paths. First one is the card image. Can be empty.
  includes     list of what the buyer gets
  format       small info pill, like "Unity package (.unitypackage)"
  sold         number you update by hand (there is no server to count it)
  buy          your Stripe Payment Link (paid items). Leave "" for "Coming soon".
  file         direct download path (FREE items only, this is public)
*/

window.PRODUCTS = [
    {
        slug: "sample-free-script",
        title: "Sample Free Script",
        blurb: "Replace me with a free tool or script you made.",
        description: [
            "This is placeholder text. Explain what your script does and how to install it.",
            "Free items link straight to a file, so anyone can download them."
        ],
        category: "script",
        price: 0,
        images: [],
        includes: ["1 script file", "Short install notes"],
        format: "C# script (.cs)",
        sold: 25,
        buy: "",
        file: "downloads/sample-free-script.zip"
    },
    {
        slug: "sample-model-pack",
        title: "Sample Model Pack",
        blurb: "A paid 3D model bundle. Swap in your own details.",
        description: [
            "Paid items send buyers to Stripe to pay, then back to your thank-you page.",
            "Add screenshots to the images list (paths start with ../Assets/ so they point out of the Shop folder)."
        ],
        category: "3d model",
        price: 2.99,
        images: [],
        includes: ["Model files (.fbx)", "Textures", "Setup guide"],
        format: "FBX + PNG textures",
        sold: 3,
        buy: "",
        file: ""
    },
    {
        slug: "sample-eye-shader",
        title: "Sample Shader",
        blurb: "A shader with a price tag, to show how cards look.",
        description: [
            "Describe what the effect looks like and which programs or engines it works in."
        ],
        category: "shader",
        price: 1.99,
        images: [],
        includes: ["Shader file", "Example material", "Instructions"],
        format: "Shader (.shader)",
        sold: 5,
        buy: "",
        file: ""
    },
    {
        slug: "sample-starter-bundle",
        title: "Sample Starter Bundle",
        blurb: "Several things together for one price.",
        description: [
            "Bundles are a nice way to sell a few related items at a small discount."
        ],
        category: "bundle",
        price: 4.99,
        images: [],
        includes: ["Everything in the model pack", "Everything in the shader", "Bonus files"],
        format: "ZIP",
        sold: 0,
        buy: "",
        file: ""
    }
];