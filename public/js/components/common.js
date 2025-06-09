
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
}


const pagePreview = document.querySelector('[data-page-preview]');
if (pagePreview) {
    const copyLinkButton = document.querySelector(".js-copy-link");
    copyLinkButton && copyLinkButton.addEventListener("click", copyLink);

    function copyLink() {
        const url = window.location.href;
        const urlObj = new URL(url);
        urlObj.searchParams.delete("isPreview");

        if (document.hasFocus()) {
            navigator.clipboard.writeText(urlObj.toString())
                .then(() => {
                    alert("Đã copy link thành công!");
                })
                .catch(err => {
                    alert("Không thể copy link");
                    console.error(err);
                });
        } else {
            alert('Không thể copy vì trình duyệt chưa focus tab này!');
        }
    }

    document.addEventListener('click', () => {
        const music = document.getElementById('bgMusic');
        if (music) {
            music.muted = false;
            music.play();
        }
    });
}