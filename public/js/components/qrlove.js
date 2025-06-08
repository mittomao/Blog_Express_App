
const createQrLovePage = document.querySelector('.qr-love-form');
if (createQrLovePage) {
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

    const uploadForm = createQrLovePage.querySelector('form');

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