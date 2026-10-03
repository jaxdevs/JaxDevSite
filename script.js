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
