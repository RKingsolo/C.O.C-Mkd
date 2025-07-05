
// JavaScript for the website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to clicked link
            this.classList.add('active');

            // Hide all page contents
            pageContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show the selected page content
            const pageId = this.getAttribute('data-page') + '-page';
            document.getElementById(pageId).classList.remove('hidden');

            // Close mobile menu if open
            mobileMenu.classList.add('hidden');

            // Scroll to top
            window.scrollTo(0, 0);
        });
    });

    // Handle hash-based section loading on page load
    const initialHash = window.location.hash;
    let matched = false;

    if (initialHash) {
        const targetPage = initialHash.replace('#', '').replace('-page', '');
        const targetLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);

        if (targetLink) {
            targetLink.click();
            matched = true;
        }
    }

    if (!matched) {
        document.querySelector('.nav-link.active').click(); // fallback to home
    }

    // Admin login functionality
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const frontendView = document.getElementById('frontend-view');
    const adminDashboard = document.getElementById('admin-dashboard');

    // Show admin login button
    document.getElementById('admin-login-section').classList.remove('hidden');

    adminLoginBtn.addEventListener('click', function() {
        adminLoginModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        adminLoginModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
    });

    // Simple admin login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === 'admin' && password === 'password123') {
            loginError.classList.add('hidden');
            adminLoginModal.style.display = 'none';

            frontendView.classList.add('hidden');
            adminDashboard.classList.remove('hidden');

            document.querySelector('.admin-nav-link.active').click();
        } else {
            loginError.textContent = 'Invalid username or password';
            loginError.classList.remove('hidden');
        }
    });

    // Admin dashboard navigation
    const adminNavLinks = document.querySelectorAll('.admin-nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    adminNavLinks.forEach(link => {
        if (link.id !== 'logout-btn') {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                adminNavLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });

                this.classList.add('active');

                adminSections.forEach(section => {
                    section.classList.add('hidden');
                });

                const sectionId = this.getAttribute('data-section') + '-section';
                document.getElementById(sectionId).classList.remove('hidden');
            });
        }
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();

        adminDashboard.classList.add('hidden');
        frontendView.classList.remove('hidden');

        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
        loginError.classList.add('hidden');
    });

    // Registration required toggle for events
    document.querySelectorAll('input[name="registration"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const registrationDetails = document.getElementById('registration-details');

            if (document.getElementById('event-registration-yes').checked) {
                registrationDetails.style.display = 'block';
            } else {
                registrationDetails.style.display = 'none';
            }
        });
    });

    // File input display for sermon audio
    document.getElementById('sermon-audio').addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
        document.getElementById('file-name').textContent = fileName;
    });

    // Add activity button for service times
    let activityCounter = 3;
    document.getElementById('add-activity-btn').addEventListener('click', function() {
        const container = document.getElementById('other-activities-container');
        const newActivity = document.createElement('div');
        newActivity.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 items-end';
        newActivity.innerHTML = `
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="activity-name-${activityCounter}">
                    Activity Name
                </label>
                <input type="text" id="activity-name-${activityCounter}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="activity-day-${activityCounter}">
                    Day
                </label>
                <select id="activity-day-${activityCounter}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                </select>
            </div>
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="activity-time-${activityCounter}">
                    Time
                </label>
                <input type="time" id="activity-time-${activityCounter}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
        `;
        container.appendChild(newActivity);
        activityCounter++;
    });
});
