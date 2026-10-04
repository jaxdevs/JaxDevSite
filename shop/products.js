window.SHOP_CONFIG = {
    currency: "USD",
    contactUrl: "../support.html"
};


window.PRODUCTS = [
    {
        slug: "sample-free-script",
        title: "Sample Free Script",
        blurb: "Replace me with a free tool or script you made.",
        description: [
            "This is placeholder text. Explain what your script does and how to install it.",
            "Free items link straight to a file, so anyone can download them."
        ],
        category: ["script", "free"],
        price: 0,
        images: ["../Assets/BroDude.png", "../Assets/PLEASETRISTER.png"],
        includes: ["1 script file", "Short install notes"],
        format: "C# script (.cs)",
        buy: "",
        file: "downloads/sample-free-script.zip"
    },
    {
        slug: "sample-model-pack",
        featured: true,   // shows big at the top of the shop (only one product should have this)
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
        sold: 0,
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
        sold: 0,
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
        category: ["bundle", "3d model", "shader"],
        price: 4.99,
        images: [],
        includes: ["Everything in the model pack", "Everything in the shader", "Bonus files"],
        format: "ZIP",
        sold: 0,
        buy: "",
        file: ""
    }
];