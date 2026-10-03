// Shared by every page.

// Footer year
document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
});

// Clean URLs: if someone lands on /support.html or /index.html, show /support or / instead.
// (GitHub Pages serves support.html at /support, so reloading still works.)
// Skipped locally, where a plain file server may not understand /support.
(function () {
    var local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (local || !/\.html$/.test(location.pathname)) return;
    var clean = location.pathname.replace(/(index)?\.html$/, "");
    history.replaceState(null, "", clean + location.search + location.hash);
})();

// Sneak peek viewer: links with data-lightbox open their image in the #lightbox dialog.
// Without JavaScript the link still opens the image on its own.
(function () {
    var box = document.getElementById("lightbox");
    if (!box || !box.showModal) return;
    var img = box.querySelector("img");
    var caption = box.querySelector(".lightbox-caption");

    document.addEventListener("click", function (e) {
        var link = e.target.closest("[data-lightbox]");
        if (link) {
            e.preventDefault();
            var thumb = link.querySelector("img");
            img.src = link.getAttribute("href");
            img.alt = thumb ? thumb.alt : "";
            caption.textContent = link.getAttribute("data-caption") || "";
            box.showModal();
            return;
        }
        // clicking the dark backdrop or the X closes it
        if (e.target === box || e.target.closest(".lightbox-close")) box.close();
    });
})();
