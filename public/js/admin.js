
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

    // Ckeditor
    // if ($('#editor-content').length) {
    //     CKEDITOR.replace('editor-content');
    //     CKEDITOR.on('instanceReady', function (evt) {
    //         var editor = evt.editor;

    //         editor.on('change', function (e) {
    //             var contentSpace = editor.ui.space('contents');
    //             var ckeditorFrameCollection = contentSpace.$.getElementsByTagName('iframe');
    //             var ckeditorFrame = ckeditorFrameCollection[0];
    //             var innerDoc = ckeditorFrame.contentDocument;
    //             var innerDocTextAreaHeight = $(innerDoc.body).height();
    //             console.log(innerDocTextAreaHeight);
    //         });
    //     });
    // }
    if ($('#editor-content').length) {
        tinymce.init({
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
    }

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
    // End Ckeditor

    // Image 
    // const imageLists = {
    //     'htmlcss': 'html-css.jpg',
    //     'javascript': 'javascript.png',
    //     'reactjs': 'reactjs.png',
    //     'dotnet': 'dotnet.png',
    //     'sitecore': 'sitecore.jpg',
    // }
    var btnFile = document.getElementById('thumbnail-btn');
    // var tag = document.getElementById('select-tag');
    // tag && tag.addEventListener('change', function (e) {
    //     if (e.target.value) {
    //         const value = e.target.value.replace(/\s/g, '').toLowerCase();
    //         inputFile.value = imageLists[value] || "";
    //     }
    // });
    if (btnFile) {
        var inputFile = document.getElementById('thumbnail-input');
        var previewImage = document.querySelector('.preview-image');
        // btnFile.onchange = function () {
        //     
        // }
        btnFile.addEventListener('click', () => {
            const flmngr = window.flmngr && window.flmngr.create({
                // urlFileManager: '',
                urlFiles: "/images/",
                dirFiles: "./public/images"
            });
            
            flmngr && flmngr.pickFiles({
                isMultiple: false,
                acceptExtensions: ["png", "jpeg", "jpg", "webp", "gif"],
                onFinish: function (files) {
                    if (files && files.length) {
                        if (previewImage) {
                            previewImage.classList.remove('disable');
                            previewImage.querySelector('img').src = files[0].url;
                        }

                        inputFile.value = files[0].url;
                    }
                }
            });
        });
    }

    // Select2
    $('#select-tag').each(function () {
        $(this).select2({
            theme: 'bootstrap4',
            width: 'style',
            placeholder: $(this).attr('placeholder'),
            allowClear: Boolean($(this).data('allow-clear')),
        });
    });
});