/* shop.js - draws the shop from products.js. No server needed. */
(function () {
    "use strict";

    var PRODUCTS = window.PRODUCTS || [];
    var CONFIG = window.SHOP_CONFIG || {};

    var grid = document.getElementById("product-grid");
    var chipsBox = document.getElementById("chips");
    var searchInput = document.getElementById("shop-search");
    var countEl = document.getElementById("result-count");
    var modal = document.getElementById("product-modal");
    var modalBody = document.getElementById("modal-body");

    var state = { category: "all", query: "" };
    var lastFocused = null;

    /* ---------- helpers ---------- */

    function el(tag, attrs, kids) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (key) {
            var val = attrs[key];
            if (val === null || val === undefined || val === false) return;
            if (key === "class") node.className = val;
            else if (key === "text") node.textContent = val;
            else node.setAttribute(key, val === true ? "" : val);
        });
        [].concat(kids || []).forEach(function (kid) {
            if (kid === null || kid === undefined || kid === false) return;
            node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
        });
        return node;
    }

    function money(n) {
        if (!n) return "Free";
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: CONFIG.currency || "USD"
            }).format(n);
        } catch (e) {
            return "$" + Number(n).toFixed(2);
        }
    }

    function categories() {
        var seen = {};
        PRODUCTS.forEach(function (p) { seen[p.category] = (seen[p.category] || 0) + 1; });
        return seen;
    }

    var toneOf = (function () {
        var order = Object.keys(categories());
        return function (cat) { return "tone-" + (Math.max(order.indexOf(cat), 0) % 4); };
    })();

    var glyphOf = {
        "3d model": "3D",
        "script": "{ }",
        "shader": "FX",
        "bundle": "+",
        "graphics": "art"
    };

    function placeholder(p) {
        return el("div", {
            class: "thumb-placeholder " + toneOf(p.category),
            "aria-hidden": "true",
            text: glyphOf[p.category] || p.title.charAt(0).toUpperCase()
        });
    }

    function matches(p) {
        if (state.category !== "all" && p.category !== state.category) return false;
        var q = state.query.trim().toLowerCase();
        if (!q) return true;
        var hay = [p.title, p.blurb, p.category].concat(p.tags || []).join(" ").toLowerCase();
        return q.split(/\s+/).every(function (word) { return hay.indexOf(word) !== -1; });
    }

    /* ---------- filter chips ---------- */

    function renderChips() {
        var cats = categories();
        chipsBox.textContent = "";
        var all = [["all", PRODUCTS.length]].concat(
            Object.keys(cats).map(function (c) { return [c, cats[c]]; })
        );
        all.forEach(function (pair) {
            var btn = el("button", {
                type: "button",
                class: "chip",
                "aria-pressed": String(state.category === pair[0]),
                "data-cat": pair[0]
            }, [pair[0], el("small", { text: String(pair[1]) })]);
            chipsBox.appendChild(btn);
        });
    }

    /* ---------- grid ---------- */

    function card(p) {
        var thumb = el("div", { class: "thumb" }, [
            p.images && p.images[0]
                ? el("img", { src: p.images[0], alt: "", loading: "lazy" })
                : placeholder(p),
            el("span", { class: "price-badge" + (p.price ? "" : " is-free"), text: money(p.price) })
        ]);

        var meta = el("div", { class: "product-meta" }, [
            el("span", { class: "pill", text: p.category }),
            p.sold ? el("span", { text: p.sold + " sold" }) : null
        ]);

        var link = el("a", { class: "product-card", href: "#" + p.slug, "data-slug": p.slug }, [
            thumb,
            el("div", { class: "product-body" }, [
                el("h3", { text: p.title }),
                el("p", { text: p.blurb }),
                meta
            ])
        ]);
        return el("li", {}, link);
    }

    function renderGrid() {
        var list = PRODUCTS.filter(matches);
        grid.textContent = "";

        if (!list.length) {
            var reset = el("button", { type: "button", class: "button primary", id: "reset-filters" }, "Show everything");
            grid.appendChild(el("li", { class: "empty-state" }, [
                el("h2", { text: "Nothing matches that" }),
                el("p", { text: "Try a different word, or clear the filters." }),
                reset
            ]));
        } else {
            list.forEach(function (p) { grid.appendChild(card(p)); });
        }
        countEl.textContent = list.length + (list.length === 1 ? " item" : " items");
    }

    /* ---------- product dialog ---------- */

    function buyControl(p) {
        if (!p.price && p.file) {
            return el("a", { class: "button primary", href: p.file, download: true }, "Download free");
        }
        if (p.price && p.buy) {
            return el("a", { class: "button primary", href: p.buy, rel: "noopener" }, "Buy for " + money(p.price));
        }
        return el("span", { class: "button is-disabled", "aria-disabled": "true" }, "Coming soon");
    }

    function gallery(p) {
        var imgs = p.images || [];
        var wrap = el("div", { class: "modal-media" });
        var main = el("div", { class: "modal-main-image" });
        wrap.appendChild(main);

        function show(i) {
            main.textContent = "";
            main.appendChild(el("img", { src: imgs[i], alt: p.title + " preview " + (i + 1) }));
            [].forEach.call(wrap.querySelectorAll(".modal-thumbs button"), function (b, idx) {
                b.setAttribute("aria-current", String(idx === i));
            });
        }

        if (!imgs.length) {
            main.appendChild(placeholder(p));
            return wrap;
        }
        if (imgs.length > 1) {
            var strip = el("div", { class: "modal-thumbs" });
            imgs.forEach(function (src, i) {
                var b = el("button", { type: "button", "aria-label": "Show image " + (i + 1) },
                    el("img", { src: src, alt: "" }));
                b.addEventListener("click", function () { show(i); });
                strip.appendChild(b);
            });
            wrap.appendChild(strip);
        }
        show(0);
        return wrap;
    }

    function fillModal(p) {
        modalBody.textContent = "";

        var facts = el("div", { class: "modal-facts" }, [
            el("span", { class: "pill", text: p.category }),
            p.format ? el("span", { class: "pill", text: p.format }) : null,
            p.sold ? el("span", { class: "pill", text: p.sold + " sold" }) : null
        ]);

        var info = el("div", { class: "modal-info" }, [
            el("h2", { id: "modal-title", text: p.title }),
            el("p", { class: "modal-price" + (p.price ? "" : " is-free"), text: money(p.price) }),
            facts,
            el("div", { class: "modal-desc" }, (p.description || [p.blurb]).map(function (t) {
                return el("p", { text: t });
            })),
            p.includes && p.includes.length
                ? el("ul", { class: "includes", "aria-label": "What you get" },
                    p.includes.map(function (t) { return el("li", { text: t }); }))
                : null,
            el("div", { class: "modal-actions" }, [
                buyControl(p),
                el("p", { class: "fine-print" }, p.price
                    ? [
                        "You pay on Stripe's secure page and come straight back here for your download. Problems? ",
                        el("a", { href: CONFIG.contactUrl || "../support.html", text: "Contact me" }),
                        "."
                    ]
                    : ["Free to use. If it helps you, tell me about it or check out my other items."])
            ])
        ]);

        modalBody.appendChild(el("div", { class: "modal-grid" }, [gallery(p), info]));
    }

    function openProduct(slug, fromHash) {
        var p = PRODUCTS.filter(function (x) { return x.slug === slug; })[0];
        if (!p) return;
        lastFocused = document.activeElement;
        fillModal(p);
        if (!modal.open) modal.showModal();
        document.title = p.title + " | shop";
        if (!fromHash) history.replaceState(null, "", "#" + slug);
    }

    function closeModalState() {
        document.title = "Shop";
        if (location.hash) history.replaceState(null, "", location.pathname + location.search);
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    /* ---------- events ---------- */

    chipsBox.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        state.category = btn.getAttribute("data-cat");
        renderChips();
        renderGrid();
    });

    searchInput.addEventListener("input", function () {
        state.query = searchInput.value;
        renderGrid();
    });

    grid.addEventListener("click", function (e) {
        var resetBtn = e.target.closest("#reset-filters");
        if (resetBtn) {
            state.category = "all";
            state.query = "";
            searchInput.value = "";
            renderChips();
            renderGrid();
            return;
        }
        var link = e.target.closest(".product-card");
        if (!link) return;
        e.preventDefault();
        openProduct(link.getAttribute("data-slug"));
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest(".modal-close")) modal.close();
    });
    modal.addEventListener("close", closeModalState);

    window.addEventListener("hashchange", function () {
        var slug = location.hash.slice(1);
        if (slug) openProduct(slug, true);
        else if (modal.open) modal.close();
    });

    /* ---------- start ---------- */

    renderChips();
    renderGrid();
    if (location.hash.length > 1) openProduct(location.hash.slice(1), true);
})();