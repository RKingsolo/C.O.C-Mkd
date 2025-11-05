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
            
            // Page navigation (hash-based) ------------------------------------------------
            // Behavior:
            // - Clicking a nav link sets location.hash = #pagename
            // - The hashchange event drives the UI update so back/forward works
            // - document.title is updated based on a data-title attribute or link text
            const navLinks = Array.from(document.querySelectorAll('.nav-link'));
            const pageContents = Array.from(document.querySelectorAll('.page-content'));

            function getPageFromHash() {
                return (location.hash && location.hash.startsWith('#')) ? location.hash.slice(1) : null;
            }

            function updateDocumentTitle(pageName) {
                if (!pageName) return;
                // Find a matching nav link to derive a friendly title
                const link = navLinks.find(l => l.getAttribute('data-page') === pageName);
                const titlePart = (link && (link.getAttribute('data-title') || link.textContent.trim())) || pageName;
                document.title = `${titlePart} — Church of Christ Makurdi`;
            }

            function showPage(pageName) {
                if (!pageName) return;
                // Deactivate all nav links
                navLinks.forEach(navLink => navLink.classList.remove('active'));

                // Activate the matching nav link (if any)
                const activeLink = navLinks.find(l => l.getAttribute('data-page') === pageName);
                if (activeLink) activeLink.classList.add('active');

                // Hide all page contents then show the target
                pageContents.forEach(content => content.classList.add('hidden'));
                const pageId = `${pageName}-page`;
                const el = document.getElementById(pageId);
                if (el) el.classList.remove('hidden');

                // Close mobile menu if open and scroll to top
                if (mobileMenu) mobileMenu.classList.add('hidden');
                window.scrollTo(0, 0);

                // Update title
                updateDocumentTitle(pageName);
            }

            // Click handlers set the hash; the hashchange handler will call showPage
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = this.getAttribute('data-page');
                    if (!page) return;
                    // Setting the hash pushes a new history state and triggers hashchange
                    location.hash = `#${page}`;
                });
            });

            // Handle back/forward and direct links to hash
            window.addEventListener('hashchange', () => {
                const page = getPageFromHash();
                if (!page) return;
                // admin routes use the prefix 'admin-<section>' (e.g. #admin-overview)
                if (page.startsWith('admin-')) {
                    const section = page.slice('admin-'.length);
                    showAdminSection(section);
                } else {
                    showPage(page);
                }
            });

            // Initial navigation: prefer hash if present, else existing .active link
            (function initialNavigation() {
                const initialHash = getPageFromHash();
                if (initialHash) {
                        if (initialHash.startsWith('admin-')) {
                            const section = initialHash.slice('admin-'.length);
                            // Defer admin routing until admin nav elements are initialized
                            setTimeout(() => { showAdminSection(section); }, 0);
                        } else {
                        showPage(initialHash);
                    }
                } else {
                    // fallback to the pre-marked active link in markup
                    const pre = document.querySelector('.nav-link.active');
                    if (pre && pre.getAttribute('data-page')) {
                        const page = pre.getAttribute('data-page');
                        // update the URL (replaceState to avoid duplicate history entry)
                        history.replaceState(null, '', `#${page}`);
                        showPage(page);
                    }
                }
            })();
            
            // About Us Image Slideshow
            const images = ["src/images/WEBUPDATE/women.jpg", "src/images/WEBUPDATE/Youth.jpg", 
                "src/images/WEBUPDATE/children.jpg","src/images/to_use/2.JPG","src/images/to_use/3.JPG", 
                "src/images/to_use/all.JPG", "src/images/to_use/Ase.JPG", "src/images/to_use/bassey.JPG", 
                "src/images/to_use/commit.jpg", "src/images/to_use/commit2.jpg", "src/images/to_use/congre.jpg", "src/images/to_use/udofot.JPG", 
                "src/images/to_use/deacon.jpg", "src/images/to_use/ejimadu.JPG", "src/images/to_use/elder.jpg",  
                "src/images/to_use/lead.JPG", "src/images/to_use/leader3.jpg", "src/images/to_use/leaders.JPG", "src/images/to_use/men.jpg", "src/images/to_use/min.JPG", "src/images/to_use/min2.JPG", 
                "src/images/to_use/oche.JPG", "src/images/to_use/onah.JPG", "src/images/to_use/ord.JPG", 
                "src/images/to_use/udofot.JPG", "src/images/to_use/papa.JPG","src/images/to_use/all2.JPG"];
            let index = 0;

            function changeImage(){
                const img = document.getElementById("slideshow");
                img.classList.remove("opacity-100");
                img.classList.add("opacity-0");

                setTimeout(() => {
                    index = (index + 1) % images.length;
                    img.src = images[index];
                    img.classList.remove("opacity-0");
                    img.classList.add("opacity-100");
                }, 300);
            }
            setInterval(changeImage, 4000); // Change image every 4 seconds

            

            // Initial navigation handled above (hash-based). No manual click needed here.

                      
            
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
                    
                    // Set overview as active by navigating to the admin hash route
                    const defaultAdminLink = document.querySelector('.admin-nav-link.active') || document.querySelector('.admin-nav-link[data-section]');
                    if (defaultAdminLink) {
                        const section = defaultAdminLink.getAttribute('data-section');
                        if (section) location.hash = `#admin-${section}`;
                    }
                } else {
                    loginError.textContent = 'Invalid username or password';
                    loginError.classList.remove('hidden');
                }
            });
            
            // Admin dashboard navigation (hash-based)
            const adminNavLinks = Array.from(document.querySelectorAll('.admin-nav-link'));
            const adminSections = Array.from(document.querySelectorAll('.admin-section'));

            function showAdminSection(sectionName) {
                if (!sectionName) return;
                // Ensure admin dashboard is visible
                if (frontendView) frontendView.classList.add('hidden');
                if (adminDashboard) adminDashboard.classList.remove('hidden');

                // Deactivate all admin nav links
                adminNavLinks.forEach(l => l.classList.remove('active'));

                // Activate the matching admin nav link
                const link = adminNavLinks.find(l => l.getAttribute('data-section') === sectionName);
                if (link) link.classList.add('active');

                // Hide all admin sections and show the requested one
                adminSections.forEach(s => s.classList.add('hidden'));
                const id = `${sectionName}-section`;
                const secEl = document.getElementById(id);
                if (secEl) secEl.classList.remove('hidden');

                // Update document title for admin section
                const titlePart = (link && (link.getAttribute('data-title') || link.textContent.trim())) || sectionName;
                document.title = `${titlePart} — Admin — Church of Christ Makurdi`;
            }

            // Clicking an admin nav link sets the hash (hashchange will handle display)
            adminNavLinks.forEach(link => {
                if (link.id !== 'logout-btn') {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const section = this.getAttribute('data-section');
                        if (!section) return;
                        location.hash = `#admin-${section}`;
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
                // Navigate back to the default frontend page (use first nav-link with data-page)
                const defaultFront = document.querySelector('.nav-link[data-page]');
                if (defaultFront && defaultFront.getAttribute('data-page')) {
                    location.hash = `#${defaultFront.getAttribute('data-page')}`;
                } else {
                    // fallback
                    location.hash = '#home';
                }
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

           
        });

        // Auto-rotating text for Our Affirmations section
        // This will display each affirmation message one by one
      const messages = [
                "1. We confess Jesus Christ as God, our Lord and Savior, who is revealed in the Bible, which is the infallible Word of God.",
                "2. We affirm our commitment to the Great Commission of our Lord, and we declare our willingness to go anywhere, do anything, and sacrifice anything God requires of us in the fulfillment of that commission.",
                "3. We respond to God's call to the biblical ministry of the evangelist, and accept our solemn responsibility to preach the Word to all peoples as God gives opportunity.",
                "4. God loves every human being, who, apart from faith in Christ, is under God's judgment and destined for hell.",
                "5. The heart of the biblical message is the good news of God's salvation, which comes by grace alone through faith in the risen Lord Jesus Christ and His atoning death on the cross for our sins.",
                "6. In our proclamation of the Gospel we recognize the urgency of calling all to decision to follow Jesus Christ as Lord and Savior, and to do so lovingly and without coercion or manipulation.",
                "7. We need and desire to be filled and controlled by the Holy Spirit as we bear witness to the Gospel of Jesus Christ, because God alone can turn sinners from their sin and bring them to everlasting life.",
                "8. We acknowledge our obligation, as servants of God,  to lead lives of holiness and moral purity, knowing that we exemplify Christ to the church and to the world.",
                "9. A life of regular and faithful prayer and Bible study is essential to our personal spiritual growth, and to our power for ministry.",
                "10. We will be faithful stewards of all that God gives us, and will be accountable to others in the finances of our ministry, and honest in reporting our statistics.",
                "11. Our families are a responsibility given to us by God, and are a sacred trust to be kept as faithfully as our call to minister to others.",
                "12. We are responsible to the church, and will endeavor always to conduct our ministries so as to build up the local body of believers and serve the church at large.",
                "13. We are responsible to arrange for the spiritual care of those who come to faith under our ministry, to encourage them to identify with the local body of believers, and seek to provide for the instruction of believers in witnessing to the Gospel.",
                "14. We share Christ's deep concern for the personal and social suffering of humanity, and we accept our responsibility as Christians and as evangelists to do our utmost to alleviate human need.",
                "15. We beseech the Body of Christ to join with us in prayer and work for peace in our world, for revival and a renewed dedication to the biblical priority of evangelism in the church, and for the oneness of believers in Christ for the fulfillment of the Great Commission, until Christ returns."
            ];
            let index = 0;
            let interValid;
            const paragraph = document.getElementById("autoText");

            function showMessage() {
                paragraph.textContent = messages[index];
                index = (index + 1) % messages.length; // Loop back
            }
            function startRotation() {
                interValid = setInterval(showMessage, 9000); // Change message every 9 seconds
            }
            function stopRotation() {
                clearInterval(interValid);
            }
            // Start the message rotation
            showMessage();
            startRotation();
            // Pause on hover, resume on mouse out
            paragraph.addEventListener("mouseover", stopRotation);
            paragraph.addEventListener("mouseout", startRotation);

