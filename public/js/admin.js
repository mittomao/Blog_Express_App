
$(function () {
    // Higlight Code
    const frame = document.querySelectorAll('.code-frame textarea');
    if (frame.length) {
        frame["forEach"](function (element) {
            var pre = document.createElement('pre');
            var code = document.createElement('code');
            var preCode = element.value
                .trim()
                .replace(/"\{/g, "'{")
                .replace(/"\[/g, "'[")
                .replace(/\}"/g, "}'")
                .replace(/\]"/g, "]'")

            var html = html_beautify(preCode, {
                indent_size: 4,
                indent_char: ' ',
                break_chained_methods: true
            })

            code.innerText = html;

            code.classList.add('html');
            pre.appendChild(code);
            element.insertAdjacentElement('afterend', pre);
            element.parentElement.removeChild(element);
        });

        hljs.highlightAll();
    }

    //Init editor
    if ($('#editor-content').length) {
        
    }
    tinymce && tinymce.init({
        selector: "#editor-content",
        plugins: "file-manager,link,image",
        toolbar: "link | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent",
        Flmngr: {
            apiKey: $('#editor-content').data('key'),//"cVGX2I8t"//"FLMNFLMN", // default free key
            // urlFileManager: '/flmngr',
            urlFiles: "/images/",
            dirFiles: "./public/images"
        },
        // Let's wait for TinyMCE is initialized...
        setup: (editor) => {
            editor.on('init', (event) => {
                // ...and get Flmngr API
                editor.getFlmngr((Flmngr) => {
                    // In this demo we pass Flmngr API into inner functions and callbacks.
                    // You can save it somewhere and reuse without passing as an argument.
                    attachOnClickListenerToButton(Flmngr);
                });
            });
        }
    });

    function attachOnClickListenerToButton(Flmngr) {
        let elBtn = document.getElementById("btn");
        if (elBtn && elBtn.length) {
            // Style button as ready to be pressed
            elBtn.style.opacity = 1;
            elBtn.style.cursor = "pointer";
            let elLoading = document.getElementById("loading");
            elLoading.parentElement.removeChild(elLoading);
            // Add a listener for selecting files
            elBtn.addEventListener("click", () => {
                selectFiles(Flmngr);
            });
        }
    }

    function selectFiles(Flmngr) {
        // Collect URLs of images of existing gallery set
        let elsExistingImages = document.querySelectorAll("#images img");
        let urls = [];
        for (let i = 0; i < elsExistingImages.length; i++)
            urls.push(elsExistingImages.item(i).src);
        Flmngr.open({
            list: urls,
            isMultiple: true,
            acceptExtensions: ["png", "jpeg", "jpg", "webp", "gif"],
            onFinish: (files) => {
                showSelectedImages(Flmngr, files);
            }
        });
    }

    function showSelectedImages(Flmngr, files) {
        let elImages = document.getElementById("images");
        if (elImages && elImages.length) {
            elImages.innerHTML = "";
            for (let file of files) {
                let urlOriginal = Flmngr.getNoCacheUrl(file.url);
                let el = document.createElement("div");
                el.className = "image";
                elImages.appendChild(el);
                let elDiv = document.createElement("div");
                el.appendChild(elDiv);
                let elImg = document.createElement("img");
                elImg.src = urlOriginal;
                elImg.alt = "Image selected in Flmngr";
                elDiv.appendChild(elImg);
                let elP = document.createElement("p");
                elP.textContent = file.url;
                el.appendChild(elP);
            }
        }
    }

    var btnFile = document.getElementById('thumbnail-btn');

    if (btnFile) {
        var inputFile = document.getElementById('thumbnail-input');
        var previewImage = document.querySelector('.preview-image');

        btnFile.addEventListener('click', () => {
            window.flmngr && window.flmngr.selectUrls({
                isMultiple: false,
                acceptExtensions: ["png", "jpeg", "jpg", "webp", "gif"],
                onFinish: (files) => {
                    if (files && files.length) {
                        if (previewImage) {
                            previewImage.classList.remove('disable');
                            previewImage.querySelector('img').src = files[0];
                        }

                        inputFile.value = files[0];
                    }
                },
                onCancel: () => {
                    console.log('Cancel');
                }
            });
        });
    }
    // End Ckeditor

    // Select2
    $('#select-tag').each(function () {
        $(this).select2({
            theme: 'bootstrap4',
            width: 'style',
            placeholder: $(this).attr('placeholder'),
            allowClear: Boolean($(this).data('allow-clear')),
        });
    });

    //Uplaod Image
    // File Upload
    // 
    function ekUpload() {
        function Init() {

            console.log("Upload Initialised");

            var fileSelect = document.getElementById('file-upload'),
                fileDrag = document.getElementById('file-drag'),
                submitButton = document.getElementById('submit-button');

            fileSelect && fileSelect.addEventListener('change', fileSelectHandler, false);

            // Is XHR2 available?
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // File Drop
                fileDrag.addEventListener('dragover', fileDragHover, false);
                fileDrag.addEventListener('dragleave', fileDragHover, false);
                fileDrag.addEventListener('drop', fileSelectHandler, false);
            }
        }

        function fileDragHover(e) {
            var fileDrag = document.getElementById('file-drag');

            e.stopPropagation();
            e.preventDefault();

            fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
        }

        function fileSelectHandler(e) {
            // Fetch FileList object
            var files = e.target.files || e.dataTransfer.files;

            // Cancel event and hover styling
            fileDragHover(e);

            // Process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                parseFile(f);
                uploadFile(f);
            }
        }

        // Output
        function output(msg) {
            // Response
            var m = document.getElementById('messages');
            m.innerHTML = msg;
        }

        function parseFile(file) {
            output(
                '<strong>' + encodeURI(file.name) + '</strong>'
            );

            // var fileType = file.type;
            // console.log(fileType);
            var imageName = file.name;

            var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
            if (isGood) {
                document.getElementById('start').classList.add("hidden");
                document.getElementById('response').classList.remove("hidden");
                document.getElementById('notimage').classList.add("hidden");
                // Thumbnail Preview
                document.getElementById('file-image').classList.remove("hidden");
                document.getElementById('file-image').src = URL.createObjectURL(file);
            }
            else {
                document.getElementById('file-image').classList.add("hidden");
                document.getElementById('notimage').classList.remove("hidden");
                document.getElementById('start').classList.remove("hidden");
                document.getElementById('response').classList.add("hidden");
                document.getElementById("file-upload-form").reset();
            }
        }

        function setProgressMaxValue(e) {
            var pBar = document.getElementById('file-progress');

            if (e.lengthComputable) {
                pBar.max = e.total;
            }
        }

        function updateFileProgress(e) {
            var pBar = document.getElementById('file-progress');

            if (e.lengthComputable) {
                pBar.value = e.loaded;
            }
        }

        async function uploadFile(file) {
            const fileUrl = await uploadFileToUploadServer(file);
            console.log('fileUrl', fileUrl);

            $.post('/admin/upload', {
                file: fileUrl
            })
                .done(function (res) {
                    alert(res.message);
                    window.location.reload();
                })
                .fail(function (err) {
                    alert("error" + err);
                })
                .always(function () {

                });
        }

        const $progressElm = $('#file-progress');
        const $uploadButton = $('#file-upload');
        async function uploadFileToUploadServer(file) {
            const upload = Upload({ apiKey: "free" });
            $uploadButton.remove();

            const fileToUpload = file;

            try {
                const { fileUrl } = await upload.uploadFile(
                    fileToUpload, {
                    onProgress: ({ progress }) => {
                        $progressElm.attr('value', progress);
                    }
                }
                );
                return fileUrl;
            } catch (error) {
                console.error(error);
            }
        }

        // Check for the various File API support.
        if (window.File && window.FileList && window.FileReader) {
            Init();
        } else {
            $('#file-drag').css('display', 'none');
        }
    }

    const $uploadForm = $('#file-upload-form');

    if ($uploadForm.length) {
        ekUpload();
    }

    const $gallerys = $('.js-gallery-item');

    $gallerys.length && $gallerys.on('click', async function (e) {
        // $(this).find('img')[0].select();
        // 
        const filename = $(this).find('img').attr('src');
        $(this).find('span').html('Copied');
        await navigator.clipboard.writeText(filename);
    });

    //End Upload Image
});