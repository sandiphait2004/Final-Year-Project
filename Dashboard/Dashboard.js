document.addEventListener('DOMContentLoaded', function() {
    // ======================== SECTION NAVIGATION ========================
    const dashboardContent = document.getElementById('dashboard-content');
    const doctorMeetupContent = document.getElementById('doctor-meetup-content');
    const historyContent = document.getElementById('history-content');
    const reportsContent = document.getElementById('reports-content');
    const settingsContent = document.getElementById('settings-content');
    const helpContent = document.getElementById('help-content');
    const dashboardLink = document.getElementById('dashboard-link');
    const doctorsLink = document.getElementById('doctors-link');
    const historyLink = document.getElementById('history-link');
    const reportsLink = document.getElementById('reports-link');
    const settingsLink = document.getElementById('settings-link');
    const helpLink = document.getElementById('help-link');
    const dashboardNav = document.querySelector('.dashboard-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const profileMenu = document.getElementById('profile-menu');

    function hideAllMainSections() {
        dashboardContent.style.display = 'none';
        doctorMeetupContent.style.display = 'none';
        historyContent.style.display = 'none';
        reportsContent.style.display = 'none';
        if (settingsContent) settingsContent.style.display = 'none';
        if (helpContent) helpContent.style.display = 'none';
    }
    function showSection(section) {
        hideAllMainSections();
        section.style.display = 'block';
    }
    function setActiveNav(link) {
        dashboardLink.classList.remove('active');
        doctorsLink.classList.remove('active');
        historyLink.classList.remove('active');
        reportsLink.classList.remove('active');
        if (link) link.classList.add('active');
    }
    function closeMobileNav() {
        if (window.innerWidth <= 768 && dashboardNav) {
            dashboardNav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        }
    }

    // Main navigation
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(dashboardContent);
            setActiveNav(dashboardLink);
            closeMobileNav();
        });
    }
    if (doctorsLink) {
        doctorsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(doctorMeetupContent);
            setActiveNav(doctorsLink);
            closeMobileNav();
        });
    }
    if (historyLink) {
        historyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(historyContent);
            setActiveNav(historyLink);
            closeMobileNav();
        });
    }
    if (reportsLink) {
        reportsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(reportsContent);
            setActiveNav(reportsLink);
            closeMobileNav();
        });
    }
    // Settings and Help navigation
    if (settingsLink && settingsContent) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(settingsContent);
            setActiveNav(null);
            closeMobileNav();
            if (profileMenu) profileMenu.classList.remove('show');
        });
    }
    if (helpLink && helpContent) {
        helpLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(helpContent);
            setActiveNav(null);
            closeMobileNav();
            if (profileMenu) profileMenu.classList.remove('show');
        });
    }

    // ======================== MOBILE NAVIGATION ========================
    if (mobileMenuToggle && dashboardNav) {
        mobileMenuToggle.addEventListener('click', function() {
            dashboardNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (dashboardNav.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        });
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.addEventListener('click', function(e) {
                if (e.target.closest('a') && window.innerWidth <= 768) {
                    dashboardNav.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ======================== PROFILE DROPDOWN ========================
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
            profileBtn.setAttribute('aria-expanded', profileMenu.classList.contains('show'));
            profileMenu.setAttribute('aria-hidden', !profileMenu.classList.contains('show'));
            document.querySelectorAll('.profile-menu.show').forEach(menu => {
                if (menu !== profileMenu) {
                    menu.classList.remove('show');
                    menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('aria-hidden', 'true');
                }
            });
        });
        document.addEventListener('click', function() {
            profileMenu.classList.remove('show');
            profileBtn.setAttribute('aria-expanded', 'false');
            profileMenu.setAttribute('aria-hidden', 'true');
        });
        profileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ======================== FILE UPLOAD FUNCTIONALITY ========================
    const fileUploadArea = document.getElementById('file-upload-area');
    const mriUpload = document.getElementById('mri-upload');
    const uploadedFile = document.getElementById('uploaded-file');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFile = document.getElementById('remove-file');

    if (fileUploadArea && mriUpload) {
        fileUploadArea.addEventListener('click', function() {
            mriUpload.click();
        });
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.add('highlight'), false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => fileUploadArea.classList.remove('highlight'), false);
        });
        fileUploadArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });
        mriUpload.addEventListener('change', function() {
            handleFiles(this.files);
        });
        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom', 'application/octet-stream'];
                const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.dcm'];
                const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                if (!validTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
                    alert('Please upload a valid file type (JPG, PNG, PDF, or DICOM)');
                    return;
                }
                fileName.textContent = file.name.length > 20 
                    ? file.name.substring(0, 17) + '...' 
                    : file.name;
                fileSize.textContent = formatFileSize(file.size);
                uploadedFile.style.display = 'flex';
                fileUploadArea.style.display = 'none';
            }
        }
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        if (removeFile) {
            removeFile.addEventListener('click', function() {
                mriUpload.value = '';
                uploadedFile.style.display = 'none';
                fileUploadArea.style.display = 'block';
            });
        }
    }

    // ======================== FORM SUBMISSIONS ========================
    const symptomForm = document.getElementById('symptom-form');
    const mriForm = document.getElementById('mri-form');
    const loadingOverlay = document.getElementById('loading-overlay');

    if (symptomForm) {
        symptomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLoading('Analyzing your symptoms...');
            setTimeout(function() {
                hideLoading();
                document.getElementById('symptom-results').style.display = 'block';
                document.getElementById('symptom-results').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest'
                });
            }, 2000);
        });
    }

    if (mriForm) {
        mriForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!mriUpload.files.length) {
                alert('Please upload an MRI file first');
                return;
            }
            showLoading('Processing your MRI scan...');
            setTimeout(function() {
                hideLoading();
                document.getElementById('mri-results').style.display = 'block';
                document.getElementById('mri-results').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest'
                });
            }, 3000);
        });
    }

    function showLoading(message = 'Processing your request...') {
        if (loadingOverlay) {
            document.getElementById('loading-text').textContent = message;
            loadingOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ======================== SETTINGS FORM SUBMISSION ========================
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLoading('Saving your settings...');
            setTimeout(hideLoading, 1200);
        });
    }

    // ======================== HELP CHAT FUNCTIONALITY ========================
    const helpChatForm = document.getElementById('help-chat-form');
    const helpChatInput = document.getElementById('help-chat-input');
    const helpChatMessages = document.getElementById('help-chat-messages');
    if (helpChatForm && helpChatInput && helpChatMessages) {
        helpChatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = helpChatInput.value.trim();
            if (!msg) return;
            // User message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.innerHTML = `<span>${msg}</span>`;
            helpChatMessages.appendChild(userMsg);
            helpChatInput.value = '';
            helpChatMessages.scrollTop = helpChatMessages.scrollHeight;
            // Simulate support reply
            setTimeout(() => {
                const supportMsg = document.createElement('div');
                supportMsg.className = 'chat-message support';
                supportMsg.innerHTML = `<span>Thank you! Our team will respond shortly.</span>`;
                helpChatMessages.appendChild(supportMsg);
                helpChatMessages.scrollTop = helpChatMessages.scrollHeight;
            }, 1200);
        });
    }

    // ======================== HELP EMAIL FORM SUBMISSION ========================
    const helpEmailForm = document.getElementById('help-email-form');
    if (helpEmailForm) {
        helpEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLoading('Sending your email...');
            setTimeout(() => {
                hideLoading();
                alert('Your message has been sent! Our team will contact you soon.');
                helpEmailForm.reset();
            }, 1200);
        });
    }

    // ======================== WINDOW RESIZE HANDLER ========================
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && dashboardNav) {
            dashboardNav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        }
    });

    // ======================== INITIALIZE COMPONENTS ========================
    if (loadingOverlay) loadingOverlay.classList.remove('show');
    const resultsSections = document.querySelectorAll('.analysis-results');
    resultsSections.forEach(section => {
        section.style.display = 'none';
    });
    if (uploadedFile) uploadedFile.style.display = 'none';
    const loadingButtons = document.querySelectorAll('.btn-loading');
    loadingButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    // Show dashboard section by default
    showSection(dashboardContent);
    setActiveNav(dashboardLink);
});
