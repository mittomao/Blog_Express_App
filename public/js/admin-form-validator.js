/**
 * Admin Form Validation, Feedback & Submit State Engine
 * Designed for Blog Express App Admin CMS
 */

export const AdminNotifier = {
    /**
     * Show a modern Tabler toast notification
     */
    showToast: function ({ title = '', message = '', type = 'info', duration = 4000 }) {
        const container = document.getElementById('adminToastContainer');
        if (!container) return;

        const toastId = 'toast-' + Date.now();
        const iconMap = {
            success: 'ti-circle-check text-success',
            error: 'ti-alert-triangle text-danger',
            warning: 'ti-alert-circle text-warning',
            info: 'ti-info-circle text-primary'
        };

        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center shadow-sm border-0 mb-2';
        toastEl.id = toastId;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="ti ${iconMap[type] || iconMap.info} fs-2"></i>
                    <div>
                        ${title ? `<div class="fw-bold">${title}</div>` : ''}
                        <div class="small text-muted">${message}</div>
                    </div>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toastEl);
        if (window.bootstrap && window.bootstrap.Toast) {
            const bsToast = new window.bootstrap.Toast(toastEl, { delay: duration, autohide: duration > 0 });
            bsToast.show();
            toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
        }
    },

    /**
     * Show accessible Tabler confirmation modal for destructive actions
     */
    confirmAction: function ({ title = 'Are you sure?', message = 'This action cannot be undone.', confirmText = 'Yes, Delete', onConfirm }) {
        const modalEl = document.getElementById('adminConfirmModal');
        if (!modalEl || !window.bootstrap) {
            if (window.confirm(message)) {
                onConfirm && onConfirm();
            }
            return;
        }

        const titleEl = document.getElementById('adminConfirmModalTitle');
        const msgEl = document.getElementById('adminConfirmModalMessage');
        const confirmBtn = document.getElementById('adminConfirmModalConfirmBtn');
        const cancelBtn = document.getElementById('adminConfirmModalCancelBtn');

        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
        if (confirmBtn) confirmBtn.textContent = confirmText;

        const modalInstance = new window.bootstrap.Modal(modalEl);

        const handleConfirm = function () {
            confirmBtn.removeEventListener('click', handleConfirm);
            modalInstance.hide();
            onConfirm && onConfirm();
        };

        confirmBtn.addEventListener('click', handleConfirm, { once: true });
        modalInstance.show();

        modalEl.addEventListener('shown.bs.modal', function () {
            if (cancelBtn) cancelBtn.focus(); // Safe default focus
        }, { once: true });
    }
};

/**
 * Main Form Validation & Submit State Handler
 */
export function initAdminFormValidation() {
    // 1. Process URL Toast Flags on Page Load
    handleUrlToastFlags();

    // 2. Setup Destructive Confirmations (Delete buttons)
    setupDeleteConfirmations();

    // 3. Setup Form Validations & Submit State Machines
    setupFormValidationHandlers();

    // 4. Setup Unsaved Changes Guard
    setupUnsavedChangesGuard();
}

/**
 * Read query string for feedback toast messages
 */
function handleUrlToastFlags() {
    const urlParams = new URLSearchParams(window.location.search);
    const toastFlag = urlParams.get('toast');
    const status = urlParams.get('status') || 'success';
    const customMsg = urlParams.get('msg');

    if (toastFlag) {
        const messages = {
            post_created: 'Post has been published successfully.',
            post_updated: 'Post has been updated successfully.',
            post_deleted: 'Post has been permanently deleted.',
            tag_created: 'Tag has been created successfully.',
            tag_updated: 'Tag has been updated successfully.',
            tag_deleted: 'Tag has been deleted.',
            widget_updated: 'Widget configuration updated successfully.',
            login_failed: 'Invalid username or password. Please try again.',
            error: customMsg || 'An unexpected error occurred. Please try again.'
        };

        AdminNotifier.showToast({
            title: status === 'success' ? 'Success' : 'Error',
            message: messages[toastFlag] || customMsg || 'Action completed.',
            type: status === 'success' ? 'success' : 'error',
            duration: status === 'success' ? 4000 : 7000
        });

        // Clean up URL parameters without page refresh
        urlParams.delete('toast');
        urlParams.delete('status');
        urlParams.delete('msg');
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
        window.history.replaceState({}, document.title, newUrl);
    }
}

/**
 * Handle confirmation modal for forms with data-confirm-delete
 */
function setupDeleteConfirmations() {
    document.querySelectorAll('form[data-confirm-delete]').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = form.getAttribute('data-delete-title') || 'Confirm Deletion';
            const message = form.getAttribute('data-confirm-delete') || 'Do you really want to delete this record? This action cannot be undone.';
            
            AdminNotifier.confirmAction({
                title: title,
                message: message,
                confirmText: 'Yes, Delete',
                onConfirm: () => {
                    form.removeAttribute('data-confirm-delete'); // Avoid re-intercepting
                    form.submit();
                }
            });
        });
    });
}

/**
 * Setup inline validation and submit state for all admin forms
 */
function setupFormValidationHandlers() {
    const forms = document.querySelectorAll('form[data-validate="true"], form[action*="/admin/add-post"], form[action*="/admin/update-post"], form[action*="/admin/add-tag"], form[action*="/admin/update-tag"], form[action*="/admin/login"], form[action*="/admin/components"]');

    forms.forEach(form => {
        let isSubmitting = false;

        // Realtime clear validation on user input
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => clearFieldError(input));
            input.addEventListener('change', () => clearFieldError(input));
        });

        form.addEventListener('submit', function (e) {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }

            const errors = validateFormFields(form);

            if (errors.length > 0) {
                e.preventDefault();
                e.stopPropagation();

                // Highlight all invalid fields
                errors.forEach(({ input, message }) => {
                    setFieldError(input, message);
                });

                // Auto-focus the first invalid field
                if (errors[0] && errors[0].input) {
                    errors[0].input.focus();
                    errors[0].input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                AdminNotifier.showToast({
                    title: 'Form Validation Error',
                    message: 'Please review and correct the highlighted fields before submitting.',
                    type: 'error',
                    duration: 5000
                });

                return false;
            }

            // Valid form -> Trigger loading state & prevent duplicate submission
            isSubmitting = true;
            window.__isAdminFormSubmitting = true; // Flag for unsaved changes guard
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

            if (submitBtn) {
                submitBtn.classList.add('btn-loading');
                submitBtn.setAttribute('disabled', 'disabled');
            }

            // Fallback timeout in case server hangs
            setTimeout(() => {
                if (isSubmitting) {
                    isSubmitting = false;
                    window.__isAdminFormSubmitting = false;
                    if (submitBtn) {
                        submitBtn.classList.remove('btn-loading');
                        submitBtn.removeAttribute('disabled');
                    }
                }
            }, 15000);
        });
    });
}

/**
 * Validate fields according to business rules
 */
function validateFormFields(form) {
    const errors = [];
    const action = form.getAttribute('action') || '';

    // 1. Post Forms (add-post, update-post)
    if (action.includes('add-post') || action.includes('update-post')) {
        const titleInput = form.querySelector('input[name="title"]');
        if (titleInput) {
            const val = (titleInput.value || '').trim();
            if (!val) {
                errors.push({ input: titleInput, message: 'Title is required.' });
            } else if (val.length < 5 || val.length > 200) {
                errors.push({ input: titleInput, message: 'Title must be between 5 and 200 characters.' });
            }
        }

        const summaryInput = form.querySelector('textarea[name="summary"]');
        if (summaryInput) {
            const val = (summaryInput.value || '').trim();
            if (val.length > 500) {
                errors.push({ input: summaryInput, message: 'Summary cannot exceed 500 characters.' });
            }
        }

        // Validate TinyMCE Content
        const editorTextarea = form.querySelector('textarea#editor-content');
        if (editorTextarea) {
            let contentText = '';
            if (window.tinymce && window.tinymce.get('editor-content')) {
                const editor = window.tinymce.get('editor-content');
                contentText = editor.getContent({ format: 'text' }).trim();
            } else {
                contentText = (editorTextarea.value || '').trim();
            }

            if (!contentText || contentText.length < 10) {
                errors.push({
                    input: editorTextarea,
                    message: 'Content cannot be empty and must contain at least 10 characters.'
                });
            }
        }

        // Validate Status
        const statusSelect = form.querySelector('select[name="status"]');
        if (statusSelect && !['0', '1'].includes(statusSelect.value)) {
            errors.push({ input: statusSelect, message: 'Please select a valid publishing status.' });
        }
    }

    // 2. Tag Forms (add-tag, update-tag)
    if (action.includes('add-tag') || action.includes('update-tag')) {
        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput) {
            const val = (nameInput.value || '').trim();
            const tagRegex = /^[a-zA-Z0-9\s\-_.,#+]+$/;
            if (!val) {
                errors.push({ input: nameInput, message: 'Tag name is required.' });
            } else if (val.length < 2 || val.length > 50) {
                errors.push({ input: nameInput, message: 'Tag name must be between 2 and 50 characters.' });
            } else if (!tagRegex.test(val)) {
                errors.push({ input: nameInput, message: 'Tag name contains invalid special characters.' });
            }
        }
    }

    // 3. Login Form
    if (action.includes('/admin/login')) {
        const usernameInput = form.querySelector('input[name="username"]');
        if (usernameInput) {
            const val = (usernameInput.value || '').trim();
            if (!val || val.length < 3) {
                errors.push({ input: usernameInput, message: 'Username is required (min 3 characters).' });
            }
        }

        const passwordInput = form.querySelector('input[name="password"]');
        if (passwordInput) {
            const val = passwordInput.value || '';
            if (!val || val.length < 6) {
                errors.push({ input: passwordInput, message: 'Password is required (min 6 characters).' });
            }
        }
    }

    // 4. Component Widget Forms (about_author, newsletter, popular_articles, portfolio)
    if (action.includes('components')) {
        const titleInput = form.querySelector('input[name="title"]');
        if (titleInput) {
            const val = (titleInput.value || '').trim();
            if (!val) {
                errors.push({ input: titleInput, message: 'Title is required.' });
            } else if (val.length < 3 || val.length > 200) {
                errors.push({ input: titleInput, message: 'Title must be between 3 and 200 characters.' });
            }
        }

        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput) {
            const val = (nameInput.value || '').trim();
            if (!val) {
                errors.push({ input: nameInput, message: 'Name is required.' });
            } else if (val.length < 2 || val.length > 100) {
                errors.push({ input: nameInput, message: 'Name must be between 2 and 100 characters.' });
            }
        }

        const authorInput = form.querySelector('input[name="author"]');
        if (authorInput) {
            const val = (authorInput.value || '').trim();
            if (!val) {
                errors.push({ input: authorInput, message: 'Author name is required.' });
            }
        }
    }

    // 5. Generic HTML5 [required] fallback for any missed field
    form.querySelectorAll('[required]').forEach(reqInput => {
        const alreadyChecked = errors.some(e => e.input === reqInput);
        if (!alreadyChecked) {
            const val = (reqInput.value || '').trim();
            if (!val) {
                const label = form.querySelector(`label[for="${reqInput.id}"]`)?.textContent?.replace('*', '').trim() || reqInput.name || 'This field';
                errors.push({ input: reqInput, message: `${label} is required.` });
            }
        }
    });

    return errors;
}

/**
 * Display inline validation error
 */
function setFieldError(input, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    let feedbackEl = input.parentElement.querySelector('.invalid-feedback');
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.className = 'invalid-feedback';
        input.parentElement.appendChild(feedbackEl);
    }

    feedbackEl.innerHTML = `<i class="ti ti-alert-circle me-1"></i> ${message}`;
    const errorId = (input.id || input.name || 'field') + '-error';
    feedbackEl.id = errorId;
    feedbackEl.setAttribute('role', 'alert');
    input.setAttribute('aria-describedby', errorId);
}

/**
 * Clear inline validation error
 */
function clearFieldError(input) {
    if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        const feedbackEl = input.parentElement.querySelector('.invalid-feedback');
        if (feedbackEl) {
            feedbackEl.innerHTML = '';
        }
    }
}

/**
 * Setup Unsaved Changes Guard for edit-post and add-post
 */
function setupUnsavedChangesGuard() {
    const editForm = document.querySelector('form[action*="/admin/update-post"], form[action*="/admin/add-post"]');
    if (!editForm) return;

    let isDirty = false;

    // Track input changes
    editForm.addEventListener('input', () => { isDirty = true; });
    editForm.addEventListener('change', () => { isDirty = true; });

    // Track TinyMCE changes
    if (window.tinymce) {
        const checkTinyMCE = setInterval(() => {
            const editor = window.tinymce.get('editor-content');
            if (editor) {
                editor.on('input change keyup NodeChange', () => { isDirty = true; });
                clearInterval(checkTinyMCE);
            }
        }, 500);
    }

    // 1. Browser unload / refresh event
    window.addEventListener('beforeunload', function (e) {
        if (isDirty && !window.__isAdminFormSubmitting) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // 2. Internal link navigation interception
    document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([data-theme-toggle])').forEach(link => {
        link.addEventListener('click', function (e) {
            if (isDirty && !window.__isAdminFormSubmitting) {
                const targetUrl = link.getAttribute('href');
                if (targetUrl && !targetUrl.startsWith('javascript:')) {
                    e.preventDefault();

                    const modalEl = document.getElementById('adminUnsavedModal');
                    if (modalEl && window.bootstrap) {
                        const leaveBtn = document.getElementById('adminUnsavedModalLeaveBtn');
                        const modalInstance = new window.bootstrap.Modal(modalEl);

                        leaveBtn.onclick = function () {
                            isDirty = false;
                            window.location.href = targetUrl;
                        };

                        modalInstance.show();
                    } else if (window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
                        isDirty = false;
                        window.location.href = targetUrl;
                    }
                }
            }
        });
    });
}
