
$(function () {
    // Higlight Code
    const frame = document.querySelectorAll('.code-frame textarea');
    if (frame) {
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
    if ($('#editor-content').length) {
        CKEDITOR.replace('editor-content');
        CKEDITOR.on('instanceReady', function (evt) {
            var editor = evt.editor;

            editor.on('change', function (e) {
                var contentSpace = editor.ui.space('contents');
                var ckeditorFrameCollection = contentSpace.$.getElementsByTagName('iframe');
                var ckeditorFrame = ckeditorFrameCollection[0];
                var innerDoc = ckeditorFrame.contentDocument;
                var innerDocTextAreaHeight = $(innerDoc.body).height();
                console.log(innerDocTextAreaHeight);
            });
        });
    }

    // Image 
    const imageLists = {
        'htmlcss': 'html-css.jpg',
        'javascript': 'javascript.png',
        'reactjs': 'reactjs.png',
        'dotnet': 'dotnet.png',
        'sitecore': 'sitecore.jpg',
    }
    var btnFile = document.getElementById('thumbnail-btn');
    var tag = document.getElementById('select-tag');
    tag && tag.addEventListener('change', function (e) {
        if (e.target.value) {
            const value = e.target.value.replace(/\s/g, '').toLowerCase();
            inputFile.value = imageLists[value] || "";
        }
    });
    if (btnFile) {
        var inputFile = document.getElementById('thumbnail-input');
        var previewImage = document.querySelector('.preview-image');
        btnFile.onchange = function () {
            if (btnFile.files[0]) {
                previewImage.classList.remove('disable');
                previewImage.querySelector('img').src = URL.createObjectURL(btnFile.files[0]);
                inputFile.value = btnFile.files[0].name;
            }
        }
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