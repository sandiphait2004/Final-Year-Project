// ======================== PROFILE PAGE JAVASCRIPT ========================

class ProfileManager {
    constructor() {
        this.currentTab = 'personal';
        this.isEditing = {
            personal: false,
            medical: false
        };
        this.originalData = {};
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeToggles();
        this.loadInitialData();
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Edit buttons
        document.getElementById('edit-personal')?.addEventListener('click', () => this.toggleEdit('personal'));
        document.getElementById('edit-medical')?.addEventListener('click', () => this.toggleEdit('medical'));

        // Cancel buttons
        document.getElementById('cancel-personal')?.addEventListener('click', () => this.cancelEdit('personal'));
        document.getElementById('cancel-medical')?.addEventListener('click', () => this.cancelEdit('medical'));

        // Form submissions
        document.getElementById('personal-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e, 'personal'));
        document.getElementById('medical-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e, 'medical'));
        document.getElementById('password-form')?.addEventListener('submit', (e) => this.handlePasswordChange(e));

        // Avatar upload
        document.getElementById('edit-avatar')?.addEventListener('click', () => this.openAvatarModal());
        document.getElementById('avatar-modal-close')?.addEventListener('click', () => this.closeAvatarModal());
        document.getElementById('cancel-avatar')?.addEventListener('click', () => this.closeAvatarModal());
        document.getElementById('choose-file')?.addEventListener('click', () => document.getElementById('avatar-input').click());
        document.getElementById('avatar-input')?.addEventListener('change', (e) => this.previewAvatar(e));
        document.getElementById('save-avatar')?.addEventListener('click', () => this.saveAvatar());

        // Close modal on outside click
        document.getElementById('avatar-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'avatar-modal') {
                this.closeAvatarModal();
            }
        });

        // Toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handleToggleChange(e));
        });

        // Security buttons
        document.querySelectorAll('.security-option .btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSecurityAction(e));
        });

        // Billing buttons
        document.querySelectorAll('.payment-method .btn, .billing-item .btn, .plan-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleBillingAction(e));
        });

        // Activity revoke buttons
        document.querySelectorAll('.activity-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleActivityRevoke(e));
        });
    }

    switchTab(tabName) {
        if (!tabName) return;

        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;

        // Add smooth scroll to top of content
        document.querySelector('.tab-content')?.scrollIntoView({ behavior: 'smooth' });
    }

    toggleEdit(formType) {
        const isCurrentlyEditing = this.isEditing[formType];
        
        if (!isCurrentlyEditing) {
            // Start editing
            this.startEdit(formType);
        } else {
            // Save changes
            this.saveChanges(formType);
        }
    }

    startEdit(formType) {
        this.isEditing[formType] = true;
        this.saveOriginalData(formType);

        // Enable form fields
        const form = document.getElementById(`${formType}-form`);
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.classList.add('editable');
        });

        // Update button text and show actions
        const editBtn = document.getElementById(`edit-${formType}`);
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        editBtn.classList.remove('btn--outline');
        editBtn.classList.add('btn--primary');

        document.getElementById(`${formType}-actions`)?.classList.remove('hidden');

        this.showNotification('Edit mode enabled', 'info');
    }

    saveOriginalData(formType) {
        const form = document.getElementById(`${formType}-form`);
        const inputs = form.querySelectorAll('input, select, textarea');
        
        this.originalData[formType] = {};
        inputs.forEach(input => {
            this.originalData[formType][input.id] = input.value;
        });
    }

    cancelEdit(formType) {
        // Restore original data
        if (this.originalData[formType]) {
            Object.keys(this.originalData[formType]).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = this.originalData[formType][id];
                }
            });
        }

        this.exitEditMode(formType);
        this.showNotification('Changes cancelled', 'warning');
    }

    exitEditMode(formType) {
        this.isEditing[formType] = false;

        // Disable form fields
        const form = document.getElementById(`${formType}-form`);
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
                input.setAttribute('readonly', 'true');
                if (input.tagName === 'SELECT') {
                    input.setAttribute('disabled', 'true');
                }
                input.classList.remove('editable');
            }
        });

        // Reset button
        const editBtn = document.getElementById(`edit-${formType}`);
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editBtn.classList.add('btn--outline');
        editBtn.classList.remove('btn--primary');

        document.getElementById(`${formType}-actions`)?.classList.add('hidden');
    }

    handleFormSubmit(e, formType) {
        e.preventDefault();
        
        if (this.validateForm(formType)) {
            this.saveChanges(formType);
        }
    }

    validateForm(formType) {
        const form = document.getElementById(`${formType}-form`);
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(phoneField.value)) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    saveChanges(formType) {
        // Simulate API call
        this.showNotification('Saving changes...', 'info');
        
        setTimeout(() => {
            this.exitEditMode(formType);
            this.updateProfileDisplay(formType);
            this.showNotification('Changes saved successfully!', 'success');
        }, 1000);
    }

    updateProfileDisplay(formType) {
        if (formType === 'personal') {
            // Update header info
            const firstName = document.getElementById('first-name')?.value;
            const lastName = document.getElementById('last-name')?.value;
            const email = document.getElementById('email')?.value;

            if (firstName && lastName) {
                document.getElementById('profile-name').textContent = `${firstName} ${lastName}`;
            }
            if (email) {
                document.getElementById('profile-email').textContent = email;
            }
        }
    }

    handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('Password must be at least 8 characters long', 'error');
            return;
        }

        // Simulate password change
        this.showNotification('Updating password...', 'info');
        
        setTimeout(() => {
            document.getElementById('password-form').reset();
            this.showNotification('Password updated successfully!', 'success');
        }, 1000);
    }

    openAvatarModal() {
        const modal = document.getElementById('avatar-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAvatarModal() {
        const modal = document.getElementById('avatar-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset file input
        document.getElementById('avatar-input').value = '';
    }

    previewAvatar(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('avatar-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    saveAvatar() {
        const fileInput = document.getElementById('avatar-input');
        if (!fileInput.files[0]) {
            this.showNotification('Please select an image first', 'error');
            return;
        }

        this.showNotification('Uploading avatar...', 'info');

        // Simulate upload
        setTimeout(() => {
            const newAvatarSrc = document.getElementById('avatar-preview').src;
            document.getElementById('profile-image').src = newAvatarSrc;
            
            this.closeAvatarModal();
            this.showNotification('Avatar updated successfully!', 'success');
        }, 1500);
    }

    initializeToggles() {
        // Set initial toggle states based on data attributes or default values
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            // You can set initial states here based on user preferences
            // For demo purposes, some are checked by default in HTML
        });
    }

    handleToggleChange(e) {
        const toggle = e.target;
        const setting = this.getToggleSetting(toggle);
        const isEnabled = toggle.checked;

        this.showNotification(
            `${setting} ${isEnabled ? 'enabled' : 'disabled'}`, 
            'info'
        );

        // Here you would typically save the preference to the backend
        this.savePreference(setting, isEnabled);
    }

    getToggleSetting(toggle) {
        const preferenceItem = toggle.closest('.preference-item');
        const title = preferenceItem?.querySelector('h3')?.textContent;
        return title || 'Setting';
    }

    savePreference(setting, value) {
        // Simulate API call to save preference
        console.log(`Saving preference: ${setting} = ${value}`);
    }

    handleSecurityAction(e) {
        const btn = e.target.closest('.btn');
        const action = btn.textContent.trim().toLowerCase();
        
        if (action.includes('configure')) {
            this.showNotification('Opening SMS configuration...', 'info');
        } else if (action.includes('enable')) {
            this.showNotification('Setting up authenticator app...', 'info');
        }
    }

    handleBillingAction(e) {
        const btn = e.target.closest('.btn');
        const action = btn.textContent.trim().toLowerCase();
        
        if (action.includes('change plan')) {
            this.showNotification('Redirecting to plan selection...', 'info');
        } else if (action.includes('manage subscription')) {
            this.showNotification('Opening subscription management...', 'info');
        } else if (action.includes('add payment')) {
            this.showNotification('Opening payment method form...', 'info');
        } else if (action.includes('download')) {
            this.downloadInvoice(btn);
        }
    }

    downloadInvoice(btn) {
        const billingItem = btn.closest('.billing-item');
        const invoice = billingItem?.querySelector('.invoice')?.textContent;
        
        this.showNotification(`Downloading ${invoice}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            this.showNotification('Invoice downloaded successfully!', 'success');
        }, 1000);
    }

    handleActivityRevoke(e) {
        const btn = e.target.closest('.btn');
        if (btn.textContent.trim().toLowerCase().includes('revoke')) {
            const activityItem = btn.closest('.activity-item');
            const deviceInfo = activityItem?.querySelector('h4')?.textContent;
            
            if (confirm(`Are you sure you want to revoke access for ${deviceInfo}?`)) {
                this.showNotification('Revoking device access...', 'info');
                
                setTimeout(() => {
                    activityItem.style.opacity = '0.5';
                    btn.textContent = 'Revoked';
                    btn.disabled = true;
                    this.showNotification('Device access revoked', 'success');
                }, 1000);
            }
        }
    }

    loadInitialData() {
        // Simulate loading user data
        console.log('Loading user profile data...');
        
        // You can populate fields with data from an API here
        // For now, the data is hardcoded in the HTML
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        });

        // Set background color based on type
        const colors = {
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
        notification.style.background = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});

// Add some utility functions for enhanced functionality
window.ProfileUtils = {
    // Format phone number as user types
    formatPhoneNumber: (input) => {
        const x = input.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        input.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    },

    // Calculate age from date of birth
    calculateAge: (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    // Generate password strength indicator
    checkPasswordStrength: (password) => {
        let strength = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[^a-zA-Z\d]/.test(password)
        ];
        
        strength = checks.filter(Boolean).length;
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return {
            score: strength,
            level: levels[strength] || 'Very Weak',
            percentage: (strength / 5) * 100
        };
    }
};

// Add CSS for notifications if not already present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-content i {
            font-size: 1.1rem;
        }
        
        .editable {
            background: white !important;
            border-color: #3b82f6 !important;
        }
        
        .field-error {
            animation: shake 0.3s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}