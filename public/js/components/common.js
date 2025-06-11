
const pageCreate = document.querySelector('[data-page-create]');
if (pageCreate) {
    // Hiện popup loading khi submit form
    const uploadForm = pageCreate.querySelector('form');

    uploadForm && uploadForm.addEventListener('submit', function (e) {
        // Hiện popup loading
        Swal.fire({
            title: 'Đang xử lý ...',
            text: 'Vui lòng chờ trong giây lát',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                uploadForm.submit();
            }
        });

        // Ngăn gửi ngay, đợi SweetAlert hiện xong rồi gọi lại form.submit()
        e.preventDefault();
    });

    const jsAddInput = document.querySelectorAll('.js-add-input');
    jsAddInput.forEach(item => {
        item.addEventListener('click', addInput);
    });
    function addInput() {
        const container = document.getElementById("text-container");
        const div = document.createElement("div");
        div.className = "input-group mb-2";
        div.innerHTML = `
                            <input type="text" class="form-control" placeholder="Nhập văn bản..." />
                            <div class="input-group-append">
                                <button type="button" class="btn btn-white js-remove-input">✖</button>
                            </div>`;
        container.appendChild(div);

        const jsRemoveInput = document.querySelectorAll('.js-remove-input');
        jsRemoveInput.forEach(item => {
            item.addEventListener('click', removeInput.bind(null, item));
        });
    }

    function removeInput(button) {
        button.closest(".input-group").remove();
    }

    const jsCopyLink = document.querySelector('.js-copy-link');
    jsCopyLink.addEventListener('click', copyLink);
    function copyLink() {
        const result = document.getElementById("link-result");
        result.select();
        document.execCommand("copy");
        Swal.fire({
            title: "Good job!",
            text: "Copy Link Thành Công!",
            icon: "success"
        });
    }

    function loadIframe(url) {
        const iframe = document.getElementById('iframePreview');
        const thumbnail = document.querySelector('.iframe-preview .thumbnail');

        // Ẩn thumbnail, chuẩn bị hiển thị iframe
        thumbnail.style.display = 'none';

        setTimeout(() => {
            const previewEl = document.querySelector('.iframe-preview');
            if (previewEl) {
                previewEl.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);

        // Gán URL và hiển thị iframe
        iframe.src = url;
        iframe.style.display = 'block';
    }


    function getQueryParamByUrl(param, url = window.location.href) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(param);
    }

    function loadByQuery() {
        let id = getQueryParamByUrl('id');
        if (id) {
            const base = `${window.location.origin}${window.location.pathname}`;
            const query = `preview?id=${id}`;
            const url = base + query;
            document.getElementById("link-result").value = url;
            loadIframe(url);
        }
    }

    loadByQuery();


    // Hiển thị tên file trong custom file input
    document.getElementById('images').addEventListener('change', function (event) {
        const label = this.nextElementSibling;
        const files = Array.from(this.files).map(f => f.name).join(', ');
        label.textContent = files || "Chọn ảnh...";

        const container = document.getElementById('previewContainer');
        container.innerHTML = '';

        Array.from(this.files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const col = document.createElement('div');
                col.className = 'col-sm-6 col-md-4 col-lg-3 mb-3';

                const card = document.createElement('div');
                card.className = 'preview-card';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;

                const caption = document.createElement('small');
                caption.textContent = file.name;

                card.appendChild(img);
                card.appendChild(caption);
                col.appendChild(card);
                container.appendChild(col);
            };
            reader.readAsDataURL(file);
        });
    });

    // Xóa tất cả ảnh
    const clearImage = document.getElementById('clearImages');
    clearImage.addEventListener('click', function () {
        const input = document.getElementById('images');
        input.value = "";
        input.nextElementSibling.textContent = "Chọn ảnh...";
        document.getElementById('previewContainer').innerHTML = "";
    });
}


const pagePreview = document.querySelector('[data-page-preview]');
if (pagePreview) {
    const toggleBtn = document.getElementById("toggle-music");
    const audio = document.getElementById("bg-audio");
    const iconNote = document.getElementById("icon-note");
    const iconNoteSlash = document.getElementById("icon-note-slash");
    let isPlaying = false;

    function updateIcon() {
        iconNote.style.display = isPlaying ? "block" : "none";
        iconNoteSlash.style.display = isPlaying ? "none" : "block";
        toggleBtn.classList.toggle("playing", isPlaying);
    }

    toggleBtn && toggleBtn.addEventListener("click", () => {
        if (!isPlaying) {
            audio.play().then(() => isPlaying = true).catch(() => isPlaying = false).finally(updateIcon);
        } else {
            audio.pause();
            isPlaying = false;
            updateIcon();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        isPlaying = false;
        // updateIcon();
    });
}