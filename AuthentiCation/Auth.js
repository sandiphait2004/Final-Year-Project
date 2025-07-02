// ======================== AUTHENTICATION JAVASCRIPT ========================

// ======================== UTILITY FUNCTIONS ========================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  function validatePassword(password) {
    return password.length >= 8
  }
  
  function validatePhone(phone) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return !phone || phoneRegex.test(phone.replace(/\s/g, ""))
  }
  
  function validateName(name) {
    return name.trim().length >= 2
  }
  
  // ======================== PASSWORD STRENGTH CHECKER ========================
  function checkPasswordStrength(password) {
    let strength = 0
    const feedback = []
  
    // Length check
    if (password.length >= 8) strength += 1
    else feedback.push("At least 8 characters")
  
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1
    else feedback.push("One uppercase letter")
  
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1
    else feedback.push("One lowercase letter")
  
    // Number check
    if (/\d/.test(password)) strength += 1
    else feedback.push("One number")
  
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    else feedback.push("One special character")
  
    const levels = ["", "strength-weak", "strength-fair", "strength-good", "strength-strong"]
    const labels = ["", "Weak", "Fair", "Good", "Strong"]
  
    return {
      score: strength,
      level: levels[Math.min(strength, 4)],
      label: labels[Math.min(strength, 4)],
      feedback: feedback,
    }
  }
  
  // ======================== ERROR HANDLING ========================
  function showError(inputId, message) {
    const input = document.getElementById(inputId)
    const errorElement = document.getElementById(inputId + "-error")
  
    if (input && errorElement) {
      input.classList.add("error")
      input.classList.remove("success")
      errorElement.textContent = message
      errorElement.classList.add("show")
    }
  }
  
  function hideError(inputId) {
    const input = document.getElementById(inputId)
    const errorElement = document.getElementById(inputId + "-error")
  
    if (input && errorElement) {
      input.classList.remove("error")
      errorElement.classList.remove("show")
    }
  }
  
  function showSuccess(inputId) {
    const input = document.getElementById(inputId)
    if (input) {
      input.classList.add("success")
      input.classList.remove("error")
    }
  }
  
  // ======================== LOADING STATES ========================
  function showLoading() {
    const loadingOverlay = document.getElementById("loading-overlay")
    if (loadingOverlay) {
      loadingOverlay.classList.add("show")
    }
  }
  
  function hideLoading() {
    const loadingOverlay = document.getElementById("loading-overlay")
    if (loadingOverlay) {
      loadingOverlay.classList.remove("show")
    }
  }
  
  function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId)
    if (button) {
      const textSpan = button.querySelector(".btn-text")
      const loadingSpan = button.querySelector(".btn-loading")
  
      if (textSpan && loadingSpan) {
        if (isLoading) {
          textSpan.style.display = "none"
          loadingSpan.style.display = "flex"
          button.disabled = true
        } else {
          textSpan.style.display = "flex"
          loadingSpan.style.display = "none"
          button.disabled = false
        }
      }
    }
  }
  
  // ======================== PASSWORD TOGGLE FUNCTIONALITY ========================
  function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll(".form-toggle-password")
  
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const wrapper = this.closest(".form-input-wrapper")
        const input = wrapper.querySelector(".form-input")
        const icon = this.querySelector("i")
  
        if (input.type === "password") {
          input.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          input.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  }
  
  // ======================== REAL-TIME VALIDATION ========================
  function initRealTimeValidation() {
    const inputs = document.querySelectorAll(".form-input")
  
    inputs.forEach((input) => {
      // Validate on blur
      input.addEventListener("blur", function () {
        validateField(this)
      })
  
      // Clear errors on input
      input.addEventListener("input", function () {
        const inputId = this.id
        hideError(inputId)
  
        // Special handling for password strength
        if (inputId === "password") {
          updatePasswordStrength(this.value)
        }
  
        // Real-time confirm password validation
        if (inputId === "confirm-password") {
          const password = document.getElementById("password")
          if (password && this.value && this.value !== password.value) {
            showError(inputId, "Passwords do not match")
          }
        }
      })
    })
  }
  
  function validateField(input) {
    const inputId = input.id
    const value = input.value.trim()
  
    switch (inputId) {
      case "email":
        if (!value) {
          showError(inputId, "Email is required")
          return false
        } else if (!validateEmail(value)) {
          showError(inputId, "Please enter a valid email address")
          return false
        } else {
          hideError(inputId)
          showSuccess(inputId)
          return true
        }
  
      case "password":
        if (!value) {
          showError(inputId, "Password is required")
          return false
        } else if (!validatePassword(value)) {
          showError(inputId, "Password must be at least 8 characters long")
          return false
        } else {
          hideError(inputId)
          showSuccess(inputId)
          return true
        }
  
      case "confirm-password":
        const password = document.getElementById("password")
        if (!value) {
          showError(inputId, "Please confirm your password")
          return false
        } else if (password && value !== password.value) {
          showError(inputId, "Passwords do not match")
          return false
        } else {
          hideError(inputId)
          showSuccess(inputId)
          return true
        }
  
      case "first-name":
      case "last-name":
        if (!value) {
          showError(inputId, "This field is required")
          return false
        } else if (!validateName(value)) {
          showError(inputId, "Name must be at least 2 characters long")
          return false
        } else {
          hideError(inputId)
          showSuccess(inputId)
          return true
        }
  
      case "phone":
        if (value && !validatePhone(value)) {
          showError(inputId, "Please enter a valid phone number")
          return false
        } else {
          hideError(inputId)
          if (value) showSuccess(inputId)
          return true
        }
  
      default:
        return true
    }
  }
  
  // ======================== PASSWORD STRENGTH INDICATOR ========================
  function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById("password-strength")
    if (!strengthIndicator) return
  
    const strength = checkPasswordStrength(password)
    const strengthBar = strengthIndicator.querySelector(".strength-bar")
    const strengthText = strengthIndicator.querySelector(".strength-text")
  
    // Remove all strength classes
    strengthIndicator.classList.remove("strength-weak", "strength-fair", "strength-good", "strength-strong")
  
    if (password.length > 0) {
      strengthIndicator.classList.add(strength.level)
      strengthText.textContent = `Password strength: ${strength.label}`
  
      if (strength.feedback.length > 0 && strength.score < 4) {
        strengthText.textContent += ` (Need: ${strength.feedback.join(", ")})`
      }
    } else {
      strengthText.textContent = "Password strength"
    }
  }
  
  // ======================== SIGN IN FORM HANDLING ========================
  function initSignInForm() {
    const signinForm = document.getElementById("signin-form")
    if (!signinForm) return
  
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("remember-me").checked
  
      // Validate inputs
      let isValid = true
  
      if (!validateField(document.getElementById("email"))) {
        isValid = false
      }
  
      if (!validateField(document.getElementById("password"))) {
        isValid = false
      }
  
      if (!isValid) return
  
      // Show loading state
      setButtonLoading("signin-btn", true)
      showLoading()
  
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
  
        // Simulate authentication check
        const isValidUser = await authenticateUser(email, password)
  
        if (isValidUser) {
          // Success
          hideLoading()
          setButtonLoading("signin-btn", false)
  
          // Show success message
          const successElement = document.getElementById("signin-success")
          if (successElement) {
            successElement.style.display = "flex"
          }
  
          // Store user session if remember me is checked
          if (rememberMe) {
            localStorage.setItem("medimind_remember", "true")
            localStorage.setItem("medimind_email", email)
          }
  
          // Redirect after delay
          setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html"
          }, 1500)
        } else {
          // Invalid credentials
          hideLoading()
          setButtonLoading("signin-btn", false)
          showError("password", "Invalid email or password. Please try again.")
        }
      } catch (error) {
        hideLoading()
        setButtonLoading("signin-btn", false)
        showError("password", "Sign in failed. Please check your connection and try again.")
      }
    })
  }
  
  // ======================== REGISTRATION FORM HANDLING ========================
  function initRegistrationForm() {
    const registerForm = document.getElementById("register-form")
    if (!registerForm) return
  
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const formData = {
        firstName: document.getElementById("first-name").value.trim(),
        lastName: document.getElementById("last-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirm-password").value,
        agreeTerms: document.getElementById("agree-terms").checked,
        marketingConsent: document.getElementById("marketing-consent").checked,
      }
  
      // Validate all fields
      let isValid = true
  
      // Validate required fields
      const requiredFields = ["first-name", "last-name", "email", "password", "confirm-password"]
      requiredFields.forEach((fieldId) => {
        if (!validateField(document.getElementById(fieldId))) {
          isValid = false
        }
      })
  
      // Validate optional phone field
      if (formData.phone) {
        if (!validateField(document.getElementById("phone"))) {
          isValid = false
        }
      }
  
      // Check terms agreement
      if (!formData.agreeTerms) {
        showError("agree-terms", "You must agree to the Terms of Service and Privacy Policy")
        isValid = false
      } else {
        hideError("agree-terms")
      }
  
      if (!isValid) return
  
      // Show loading state
      setButtonLoading("register-btn", true)
      showLoading()
  
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2500))
  
        // Simulate registration
        const registrationResult = await registerUser(formData)
  
        if (registrationResult.success) {
          // Success
          hideLoading()
          setButtonLoading("register-btn", false)
  
          // Show success message
          const successElement = document.getElementById("register-success")
          if (successElement) {
            successElement.style.display = "flex"
          }
  
          // Redirect after delay
          setTimeout(() => {
            window.location.href = "./login.html?registered=true"
          }, 3000)
        } else {
          // Registration failed
          hideLoading()
          setButtonLoading("register-btn", false)
  
          if (registrationResult.error === "email_exists") {
            showError("email", "An account with this email already exists. Please sign in instead.")
          } else {
            showError("email", registrationResult.message || "Registration failed. Please try again.")
          }
        }
      } catch (error) {
        hideLoading()
        setButtonLoading("register-btn", false)
        showError("email", "Registration failed. Please check your connection and try again.")
      }
    })
  }
  
  // ======================== SOCIAL LOGIN HANDLING ========================
  function initSocialLogin() {
    // Google Sign In
    const googleBtns = document.querySelectorAll("#google-signin, #google-register")
    googleBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault()
  
        showLoading()
  
        try {
          // Simulate Google OAuth
          await new Promise((resolve) => setTimeout(resolve, 2000))
  
          // Simulate successful Google login
          hideLoading()
  
          // Redirect to dashboard
          window.location.href = "../Dashboard/dashboard.html?provider=google"
        } catch (error) {
          hideLoading()
          alert("Google sign in failed. Please try again.")
        }
      })
    })
  
    // Facebook Sign In
    const facebookBtns = document.querySelectorAll("#facebook-signin, #facebook-register")
    facebookBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault()
  
        showLoading()
  
        try {
          // Simulate Facebook OAuth
          await new Promise((resolve) => setTimeout(resolve, 2000))
  
          // Simulate successful Facebook login
          hideLoading()
  
          // Redirect to dashboard
          window.location.href = "../Dashboard/dashboard.html?provider=facebook"
        } catch (error) {
          hideLoading()
          alert("Facebook sign in failed. Please try again.")
        }
      })
    })
  }
  
  // ======================== API SIMULATION FUNCTIONS ========================
  async function authenticateUser(email, password) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Demo credentials for testing
    const demoUsers = [
      { email: "demo@medimind.com", password: "password123" },
      { email: "user@medimind.com", password: "medimind2025" },
      { email: "test@example.com", password: "testpass123" },
    ]
  
    return demoUsers.some((user) => user.email === email && user.password === password)
  }
  
  async function registerUser(userData) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // Simulate email already exists check
    const existingEmails = ["existing@medimind.com", "taken@example.com", "demo@medimind.com"]
  
    if (existingEmails.includes(userData.email)) {
      return {
        success: false,
        error: "email_exists",
        message: "An account with this email already exists.",
      }
    }
  
    // Simulate successful registration
    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      userId: "user_" + Date.now(),
    }
  }
  
  // ======================== URL PARAMETER HANDLING ========================
  function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search)
  
    // Handle registration success redirect
    if (urlParams.get("registered") === "true") {
      const emailInput = document.getElementById("email")
      if (emailInput) {
        // Show a welcome message
        const successDiv = document.createElement("div")
        successDiv.className = "form-success"
        successDiv.style.display = "flex"
        successDiv.innerHTML =
          '<i class="fas fa-check-circle"></i><span>Registration successful! Please sign in with your new account.</span>'
  
        const form = document.getElementById("signin-form")
        if (form) {
          form.insertBefore(successDiv, form.firstChild)
        }
      }
    }
  
    // Handle forgot password redirect
    if (urlParams.get("reset") === "true") {
      const successDiv = document.createElement("div")
      successDiv.className = "form-success"
      successDiv.style.display = "flex"
      successDiv.innerHTML =
        '<i class="fas fa-check-circle"></i><span>Password reset successful! Please sign in with your new password.</span>'
  
      const form = document.getElementById("signin-form")
      if (form) {
        form.insertBefore(successDiv, form.firstChild)
      }
    }
  }
  
  // ======================== REMEMBER ME FUNCTIONALITY ========================
  function initRememberMe() {
    const emailInput = document.getElementById("email")
    const rememberCheckbox = document.getElementById("remember-me")
  
    // Check if user should be remembered
    if (localStorage.getItem("medimind_remember") === "true") {
      const savedEmail = localStorage.getItem("medimind_email")
      if (savedEmail && emailInput) {
        emailInput.value = savedEmail
        if (rememberCheckbox) {
          rememberCheckbox.checked = true
        }
      }
    }
  }
  
  // ======================== FORM AUTO-SAVE (DRAFT) ========================
  function initFormAutoSave() {
    const form = document.getElementById("register-form")
    if (!form) return
  
    const inputs = form.querySelectorAll(".form-input")
  
    inputs.forEach((input) => {
      // Skip password fields for security
      if (input.type === "password") return
  
      // Load saved value
      const savedValue = localStorage.getItem(`medimind_draft_${input.id}`)
      if (savedValue && !input.value) {
        input.value = savedValue
      }
  
      // Save on input
      input.addEventListener("input", function () {
        if (this.value.trim()) {
          localStorage.setItem(`medimind_draft_${this.id}`, this.value)
        } else {
          localStorage.removeItem(`medimind_draft_${this.id}`)
        }
      })
    })
  
    // Clear draft on successful submission
    form.addEventListener("submit", () => {
      inputs.forEach((input) => {
        localStorage.removeItem(`medimind_draft_${input.id}`)
      })
    })
  }
  
  // ======================== ACCESSIBILITY ENHANCEMENTS ========================
  function initAccessibility() {
    // Add ARIA live regions for dynamic content
    const body = document.body
  
    // Create live region for announcements
    const liveRegion = document.createElement("div")
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute("aria-atomic", "true")
    liveRegion.className = "sr-only"
    liveRegion.id = "live-region"
    body.appendChild(liveRegion)
  
    // Announce form errors to screen readers
    const originalShowError = window.showError
    window.showError = (inputId, message) => {
      originalShowError(inputId, message)
  
      const liveRegion = document.getElementById("live-region")
      if (liveRegion) {
        liveRegion.textContent = `Error: ${message}`
      }
    }
  
    // Add keyboard navigation for custom elements
    document.addEventListener("keydown", (e) => {
      // Handle Enter key on custom buttons
      if (e.key === "Enter" && e.target.classList.contains("form-toggle-password")) {
        e.target.click()
      }
    })
  }
  
  // ======================== INITIALIZATION ========================
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize all functionality
    initPasswordToggle()
    initRealTimeValidation()
    initSignInForm()
    initRegistrationForm()
    initSocialLogin()
    initRememberMe()
    initFormAutoSave()
    initAccessibility()
    handleUrlParameters()
  
    // Add CSS class for JavaScript-enabled styling
    document.body.classList.add("js-enabled")
  
    console.log("MediMind authentication system initialized successfully!")
  })
  
  // ======================== UTILITY CLASSES FOR SCREEN READERS ========================
  const style = document.createElement("style")
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `
  document.head.appendChild(style)
  