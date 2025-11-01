const valueSearch = window.location.pathname.includes("search") ? window.location.pathname.split("/").pop() : "";
if (valueSearch) {
    $(".js-search-input").val(decodeURI(valueSearch));
}

$(".js-search-input").on("blur", (e) => {
    doSearch();
});

$(".js-icon-search-input").on("click", (e) => {
    doSearch();
});

const input = document.querySelector('.js-search-input');
const hintList = document.getElementById('hintList');

const suggestions = hintList.dataset.hints ? hintList.dataset.hints.split('|') : [];

// Hiển thị các hint dưới input (click để điền)
function renderHintButtons() {
    hintList.innerHTML = '';
    suggestions.forEach(s => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "hint";
        btn.textContent = s;
        btn.addEventListener('click', () => {
            input.value = s;
            input.focus();
            stopPlaceholderLoop(); // user selected -> stop
        });
        hintList.appendChild(btn);
    });
}
renderHintButtons();

let loopTimer = null;
let typingTimer = null;
let currentIndex = 0;
let isRunning = false;
let charPos = 0;
const TYPING_SPEED = 60; // ms per char
const PAUSE_AFTER_FULL = 1000; // ms before erase
const PAUSE_BETWEEN_HINTS = 600; // small pause between hints

function typeNextSuggestion() {
    if (!isRunning) return;
    const text = suggestions[currentIndex];
    charPos = 0;
    input.placeholder = ""; // start blank
    function typeChar() {
        if (!isRunning) return;
        charPos++;
        input.placeholder = text.slice(0, charPos);
        if (charPos < text.length) {
            typingTimer = setTimeout(typeChar, TYPING_SPEED);
        } else {
            typingTimer = setTimeout(eraseChars, PAUSE_AFTER_FULL);
        }
    }
    function eraseChars() {
        if (!isRunning) return;
        let erasePos = text.length;
        function stepErase() {
            if (!isRunning) return;
            erasePos--;
            input.placeholder = text.slice(0, erasePos);
            if (erasePos > 0) {
                typingTimer = setTimeout(stepErase, 35);
            } else {
                currentIndex = (currentIndex + 1) % suggestions.length;
                typingTimer = setTimeout(typeNextSuggestion, PAUSE_BETWEEN_HINTS);
            }
        }
        typingTimer = setTimeout(stepErase, 35);
    }
    typeChar();
}

function startPlaceholderLoop() {
    if (isRunning) return;
    isRunning = true;
    loopTimer = setTimeout(typeNextSuggestion, 400);
}

function stopPlaceholderLoop() {
    isRunning = false;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
}

input.addEventListener('focus', () => {
    // if user hasn't typed anything, we still allow placeholder to run,
    // but if they start typing, stop the loop.
    // We'll stop on keydown if value changes.
});

function onUserInputStart() {
    if (input.value && input.value.length > 0) {
        stopPlaceholderLoop();
    } else {
        // if user clears value while focused, we may resume only after blur
    }
}
input.addEventListener('input', onUserInputStart);

input.addEventListener('blur', () => {
    if (!input.value || input.value.trim() === "") {
        setTimeout(() => {
            if (!input.value || input.value.trim() === "") startPlaceholderLoop();
        }, 200);
    } else {
        stopPlaceholderLoop();
    }
});

window.addEventListener('load', () => {
    if (!input.value || input.value.trim() === "") {
        startPlaceholderLoop();
    }
});

function doSearch() {
    const value = input.value.trim();
    if (!value) {
        alert('Vui lòng nhập từ khóa tìm kiếm hoặc chọn gợi ý.');
        input.focus();
        return;
    }
    $(".js-search-form").attr("action", `/search/${value}`);
    $(".js-search-form").submit();
}

input.addEventListener('keydown', function (e) {
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Escape'];
    if (!navKeys.includes(e.key)) {
        stopPlaceholderLoop();
    }
});