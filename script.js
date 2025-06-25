// Website Manual Document (would typically be a separate text file)
        const websiteManual = `Church of Christ Makurdi - Website Admin Manual

1. Introduction
Welcome to your church website admin panel. This manual will guide you through the process of managing and updating your church website.

2. Getting Started
- To access the admin area, click the "Admin Login" button in the footer (visible only to logged-in admins)
- Use the credentials provided to you by the website administrator
- After login, you'll see the admin dashboard with various sections

3. Managing Website Content
3.1 Pages
- Navigate to "Manage Pages" in the sidebar
- Select the page you want to edit from the list
- Make your changes in the editor
- Click "Save Changes" when done

3.2 Sermons
- To add a new sermon, click "Add New Sermon"
- Fill in all required details (title, preacher, date, etc.)
- Upload audio file (MP3 format recommended)
- Optionally upload sermon notes (PDF) and a thumbnail image
- Click "Save Sermon"

3.3 Events
- To add an event, click "Add New Event"
- Fill in event details including date, time, location, and description
- Upload a featured image if available
- Set registration options if needed
- Save when complete

4. Media Library
- Upload all images, audio files, documents here
- Organize files into categories for easy management
- Replace files by uploading new versions with the same name

5. User Management
- Add new users and assign appropriate roles
- Administrators have full access
- Editors can manage content but not settings
- Authors can only add/edit their own content

6. Website Settings
6.1 General Settings
- Edit church name, address, contact info
- Update logos and favicon
- Modify service times

6.2 Other Settings
- Newsletter settings
- Social media links
- Analytics tracking

7. Best Practices
- Always preview changes before saving
- Keep content updated regularly
- Back up important data
- Use strong passwords for admin accounts

8. Troubleshooting
- If you can't log in, use the password reset option
- For technical issues, contact your web developer
- Clear your browser cache if you see outdated content

For additional support, please contact:
support@churchofchristmakurdi.com
+234 123 456 7890`;

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
            
            // Set home page as active by default
            document.querySelector('.nav-link.active').click();
            
            // Admin login functionality
            const adminLoginBtn = document.getElementById('admin-login-btn');
            const adminLoginModal = document.getElementById('admin-login-modal');
            const closeModal = document.querySelector('.close-modal');
            const loginForm = document.getElementById('login-form');
            const loginError = document.getElementById('login-error');
            const frontendView = document.getElementById('frontend-view');
            const adminDashboard = document.getElementById('admin-dashboard');
            
            // Show admin login button (for demo purposes - would be hidden in production)
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
            
            // Simple admin login for demo purposes
            // In a real application, this would be handled by a server with proper authentication
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;
                
                // Demo credentials
                if (username === 'admin' && password === 'password123') {
                    loginError.classList.add('hidden');
                    adminLoginModal.style.display = 'none';
                    
                    // Hide frontend and show admin dashboard
                    frontendView.classList.add('hidden');
                    adminDashboard.classList.remove('hidden');
                    
                    // Set overview as active
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
                        
                        // Remove active class from all links
                        adminNavLinks.forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        
                        // Add active class to clicked link
                        this.classList.add('active');
                        
                        // Hide all admin sections
                        adminSections.forEach(section => {
                            section.classList.add('hidden');
                        });
                        
                        // Show the selected section
                        const sectionId = this.getAttribute('data-section') + '-section';
                        document.getElementById(sectionId).classList.remove('hidden');
                    });
                }
            });
            
            // Logout functionality
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Hide admin dashboard and show frontend
                adminDashboard.classList.add('hidden');
                frontendView.classList.remove('hidden');
                
                // Reset admin login form
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
            
            // You could download the manual if needed
            // console.log(websiteManual);  // This would be a downloadable text file in production

            // Newsletter

            document.getElementById("subscribeForm").addEventListener("submit", async function (e) {
                e.preventDefault();
                const email = document.getElementById("emailInput").value.trim();
                const responseElement = document.getElementById("response");
            
                if (!email) {
                  responseElement.innerText = "Please enter a valid email address.";
                  responseElement.classList.add("text-red-700");
                  return;
                }
            
                try {
                  const res = await fetch("https://script.google.com/macros/s/AKfycbwj3r-Te6V9hkB7l53URzkVl22C4mCHrPpsDIHbhqLWz4X4-Th-iXJE66VaNmjWRVRw/exec", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                  });
            
                  const result = await res.json();
                  if (result.success) {
                    responseElement.innerText = result.message;
                    responseElement.classList.remove("text-red-700");
                    responseElement.classList.add("text-green-700");
                  } else {
                    responseElement.innerText = result.message;
                    responseElement.classList.remove("text-green-700");
                    responseElement.classList.add("text-red-700");
                  }
                } catch (err) {
                  responseElement.innerText = "An error occurred. Please try again.";
                  responseElement.classList.add("text-red-700");
                }
            
                document.getElementById("emailInput").value = "";
              });           
        });