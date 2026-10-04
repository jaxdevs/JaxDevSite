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

// Scroll slider: a little scrollbar on the right with the PointingUpwards guy as the handle.
// Drag him, or click the track to jump. Hidden on phones and on pages too short to scroll.
(function () {
    var thumbSrc = new URL("Assets/ScrollThumb.png", document.currentScript.src).href;
    var slider = document.createElement("div");
    slider.className = "scroll-slider";
    slider.setAttribute("aria-hidden", "true");
    slider.innerHTML = '<div class="scroll-slider-track"><div class="scroll-slider-thumb"><img alt=""></div></div>';
    var track = slider.firstChild;
    var thumb = track.firstChild;
    var img = thumb.firstChild;
    img.src = thumbSrc;
    document.body.appendChild(slider);
    document.documentElement.classList.add("has-slider");

    var root = document.documentElement;
    var lastY = window.scrollY;
    var goingUp = false;
    var ticking = false;

    function maxScroll() { return root.scrollHeight - window.innerHeight; }

    function place() {
        var max = maxScroll();
        slider.hidden = max < 40;
        var progress = max > 0 ? window.scrollY / max : 0;
        thumb.style.top = progress * (track.clientHeight - thumb.offsetHeight) + "px";
    }

    function setDirection(up) {
        if (up === goingUp) return;
        goingUp = up;
        img.classList.toggle("pointing-up", up);
        img.classList.add("popping");
        setTimeout(function () { img.classList.remove("popping"); }, 140);
    }

    window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (y !== lastY) setDirection(y < lastY);
        lastY = y;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function () { place(); ticking = false; });
        }
    }, { passive: true });
    window.addEventListener("resize", place);
    if (window.ResizeObserver) new ResizeObserver(place).observe(document.body);

    // scroll to the spot on the track under the pointer
    function scrollToPointer(clientY, grabOffset, smooth) {
        var rect = track.getBoundingClientRect();
        var room = rect.height - thumb.offsetHeight;
        var p = Math.min(Math.max((clientY - rect.top - grabOffset) / room, 0), 1);
        root.style.scrollBehavior = smooth ? "" : "auto";
        window.scrollTo(0, p * maxScroll());
    }

    var grabOffset = 0;
    thumb.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        grabOffset = e.clientY - thumb.getBoundingClientRect().top;
        thumb.setPointerCapture(e.pointerId);
        slider.classList.add("dragging");
    });
    thumb.addEventListener("pointermove", function (e) {
        if (slider.classList.contains("dragging")) scrollToPointer(e.clientY, grabOffset, false);
    });
    function stopDrag() {
        slider.classList.remove("dragging");
        root.style.scrollBehavior = "";
    }
    thumb.addEventListener("pointerup", stopDrag);
    thumb.addEventListener("pointercancel", stopDrag);

    track.addEventListener("click", function (e) {
        if (thumb.contains(e.target)) return;
        scrollToPointer(e.clientY, thumb.offsetHeight / 2, true);
    });

    place();
})();

// Page fade: clicking a link to another page on this site fades to lavender first.
// (The fade-in when a page opens is pure CSS, see body::after in styles.css.)
(function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", function (e) {
        if (reduceMotion || e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var link = e.target.closest("a[href]");
        if (!link || link.hasAttribute("download")) return;
        if (link.target && link.target !== "_self") return;

        var url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;  // other websites: no fade
        var samePage = url.pathname === location.pathname && url.search === location.search;
        if (samePage && (url.hash || url.href === location.href)) return;  // just a jump on this page

        e.preventDefault();
        document.documentElement.classList.add("leaving");
        setTimeout(function () { location.href = url.href; }, 350);
    });

    // coming back with the Back button can restore the faded-out page, so un-fade it
    window.addEventListener("pageshow", function () {
        document.documentElement.classList.remove("leaving");
    });
})();

// Contact form (support page): topic hints, character counter, and sending in the background
// so visitors stay on the page. Without JavaScript the form still posts to FormSubmit normally.
(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var sent = document.getElementById("form-sent");
    var sentText = document.getElementById("sent-text");
    var status = document.getElementById("form-status");
    var hint = document.getElementById("topic-hint");
    var message = form.querySelector("#message");
    var counter = document.getElementById("char-count");
    var button = form.querySelector('button[type="submit"]');
    var buttonHtml = button.innerHTML;

    function showSent(name) {
        sentText.textContent = (name ? "Thanks " + name + "! " : "Thanks! ") +
            "Your message is on its way. I'll get back to you by email when I can.";
        form.hidden = true;
        sent.hidden = false;
    }

    // came back from FormSubmit after a no-JavaScript send
    if (new URLSearchParams(location.search).get("sent") === "1") showSent("");

    form.addEventListener("change", function (e) {
        if (e.target.name !== "topic") return;
        var label = form.querySelector('label[for="' + e.target.id + '"]');
        hint.textContent = label.getAttribute("data-hint");
    });

    function count() { counter.textContent = message.value.length + " / " + message.maxLength; }
    message.addEventListener("input", count);
    count();

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        status.textContent = "";
        var data = Object.fromEntries(new FormData(form));
        data._subject = "[" + (data.topic || "Message") + "] " + data.subject + " (jaxdev.dev)";
        data._replyto = data.email;
        delete data._next;

        button.disabled = true;
        button.textContent = "Sending...";

        fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
                if (String(res.success) !== "true") throw new Error(res.message || "Send failed");
                form.reset();
                count();
                hint.textContent = "Pick one so I know where to look first.";
                showSent(data.name);
            })
            .catch(function () {
                status.innerHTML = 'Hmm, that didn\'t send. Try again in a minute, or message me on <a href="https://discord.gg/5qxVttwgay">Discord</a>.';
            })
            .finally(function () {
                button.disabled = false;
                button.innerHTML = buttonHtml;
            });
    });

    document.getElementById("send-another").addEventListener("click", function () {
        sent.hidden = true;
        form.hidden = false;
        if (location.search) history.replaceState(null, "", location.pathname);
        form.querySelector("input[name=topic]").focus();
    });
})();

// Devlog: show the newest 3 updates, the rest behind a "Show older updates" button.
(function () {
    var entries = document.querySelectorAll(".log-entry");
    var more = document.querySelector(".log-more");
    if (!more || entries.length <= 3) return;
    for (var i = 3; i < entries.length; i++) entries[i].classList.add("is-older");
    more.hidden = false;
    more.addEventListener("click", function () {
        document.querySelectorAll(".log-entry.is-older").forEach(function (el) {
            el.classList.remove("is-older");
            el.classList.add("is-visible");
        });
        more.hidden = true;
    });
})();

// Game progress: work out the % from the checklist (done = 1, doing = half, todo = 0).
(function () {
    var card = document.querySelector(".progress-card");
    if (!card) return;
    var items = card.querySelectorAll(".progress-list li");
    if (!items.length) return;
    var score = 0;
    items.forEach(function (li) {
        if (li.classList.contains("done")) score += 1;
        else if (li.classList.contains("doing")) score += 0.5;
    });
    var pct = Math.round(score / items.length * 100);
    var bar = card.querySelector(".progress-bar");
    bar.setAttribute("aria-valuenow", pct);
    bar.querySelector("span").style.width = pct + "%";
    card.querySelector(".progress-pct").textContent = pct + "%";
})();

// Live Discord numbers (member count + who's online) straight from the invite link.
// If Discord doesn't answer, the card just shows the text and the Join button.
(function () {
    var card = document.getElementById("discord-card");
    if (!card || !window.fetch) return;
    var invite = card.getAttribute("data-invite");
    fetch("https://discord.com/api/v10/invites/" + invite + "?with_counts=true")
        .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
        .then(function (data) {
            if (data.guild && data.guild.name) card.querySelector(".discord-name").textContent = data.guild.name;
            if (data.approximate_member_count == null) return;
            card.querySelector(".discord-online").textContent = data.approximate_presence_count.toLocaleString();
            card.querySelector(".discord-members").textContent = data.approximate_member_count.toLocaleString();
            card.querySelector(".discord-stats").hidden = false;
        })
        .catch(function () { /* keep the plain card */ });
})();

// Scroll-in animation: sections slide up softly the first time they come into view.
// Skipped for people who turned on "reduce motion".
(function () {
    if (!window.IntersectionObserver) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // on phones the peek cards are a sideways-swipe row, so the row comes in as one piece
    var peeks = window.matchMedia("(min-width: 761px)").matches ? ".peek-grid > li" : ".peek-grid";

    var targets = document.querySelectorAll([
        ".section-heading", peeks, ".staff-board",
        ".log-entry", ".updates-side > *",
        ".shop-hero-copy", ".featured-slot", ".steps", ".faq-item", ".elsewhere",
        ".contact-head", ".message-window", ".contact-side > *",
        ".page-intro", ".shop-tools", ".music-player",
        ".error-page .eyebrow", ".error-page h1", ".error-page .intro"
    ].join(","));

    var seen = new Map();
    var watcher = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            watcher.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.12 });

    targets.forEach(function (el) {
        // items that share a parent come in one after another
        var n = seen.get(el.parentNode) || 0;
        seen.set(el.parentNode, n + 1);
        el.style.transitionDelay = Math.min(n * 80, 400) + "ms";
        el.classList.add("reveal");
        watcher.observe(el);
    });
})();
