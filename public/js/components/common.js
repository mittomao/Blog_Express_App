
const pageCreate = document.querySelector('[data-page-create]');
if (pageCreate) {
    const input = document.getElementById('images');
    const previewContainer = document.getElementById('previewContainer');

    input && input.addEventListener('change', () => {
        previewContainer.innerHTML = '';
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    const uploadForm = pageCreate.querySelector('form');

    uploadForm && uploadForm.addEventListener('submit', function (e) {
        // Hiện popup loading
        Swal.fire({
            title: 'Đang xử lý ...',
            text: 'Vui lòng chờ trong giây lát',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                uploadForm.submit(); // Tiếp tục gửi form
            }
        });

        // Ngăn gửi ngay, đợi SweetAlert hiện xong rồi gọi lại form.submit()
        e.preventDefault();
    });

    const copyLinkButton = document.querySelector(".js-copy-link");
    copyLinkButton && copyLinkButton.addEventListener("click", copyLink);

    function copyLink() {
        const iframe = document.getElementById('iframePreview');
        const urlObj = iframe.src;

        if (document.hasFocus()) {
            navigator.clipboard.writeText(urlObj)
                .then(() => {
                    Swal.fire({
                        title: "Good job!",
                        text: "Copy Link Thành Công!",
                        icon: "success"
                    });
                })
                .catch(err => {
                    Swal.fire({
                        title: "Oops!",
                        text: "Không thể copy link",
                        icon: "error"
                    });
                    console.error(err);
                });
        } else {
            alert('Không thể copy vì trình duyệt chưa focus tab này!');
        }
    }
}


const pagePreview = document.querySelector('[data-page-preview]');
if (pagePreview) {
    document.addEventListener('click', () => {
        // const music = document.getElementById('bgMusic');
        // if (music) {
        //     music.muted = false;
        //     music.play();
        // }
    });
}

function getQueryParamByUrl(param, url = window.location.href) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
}

function loadIframeByID() {
    let id = getQueryParamByUrl('id');
    if (id) {
        const iframe = document.getElementById('iframePreview');
        if (iframe) {
            let parent = iframe.parentElement;
            iframe.src = `${window.location.origin}${window.location.pathname}preview?id=${id}`;
            iframe.style.width = parent.offsetWidth + 'px';
            iframe.style.height = parent.offsetHeight + 'px';
            parent.classList.add('loaded');
        }
    }
}

loadIframeByID();