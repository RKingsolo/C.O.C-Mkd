// OOP-based Sermon rendering and management
class Sermon {
    constructor({ title = '', preacher = '', date = '', duration = '', description = '', thumbnailUrl = '', audioUrl = '', pdfUrl = '' } = {}) {
        this.title = title.trim();
        this.preacher = preacher.trim();
        this.date = Sermon.parseDate(date) || new Date();
        this.duration = duration;
        this.description = description.trim();
        this.thumbnailUrl = thumbnailUrl;
        this.audioUrl = audioUrl;
        this.pdfUrl = pdfUrl;
    }

    static parseDate(dateInput) {
        if (!dateInput) return null;
        const d = new Date(dateInput);
        if (!isNaN(d)) return d;
        // try to parse common formats like "July 20, 2025"
        const parsed = Date.parse(dateInput);
        if (!isNaN(parsed)) return new Date(parsed);
        return null;
    }

    formatDate() {
        if (!this.date) return '';
        return this.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    createSermonCard() {
        // Create compact (approx 50% smaller) sermon card using DOM methods
        const card = document.createElement('div');
        card.className = 'sermon-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300';
        // Image area - smaller height
        const imgWrap = document.createElement('div');
        imgWrap.className = 'relative h-21';
        const img = document.createElement('img');
        img.src = this.thumbnailUrl || '/src/images/logo.jpg';
        img.alt = this.title;
        img.className = 'w-full h-full object-cover';
        imgWrap.appendChild(img);
        card.appendChild(imgWrap);

        // Content
        const body = document.createElement('div');
        body.className = 'p-3'; // smaller padding

        const top = document.createElement('div');
        top.className = 'flex justify-between items-start mb-1';
        const left = document.createElement('div');
        const dateSpan = document.createElement('span');
        dateSpan.className = 'text-xs font-semibold text-blue-600';
        dateSpan.textContent = this.formatDate();
        const titleEl = document.createElement('h6');
        titleEl.className = 'text-lg font-bold text-blue-900 mt-1';
        titleEl.textContent = this.title;
        left.appendChild(dateSpan);
        left.appendChild(titleEl);
        const dur = document.createElement('span');
        dur.className = 'bg-blue-100 text-blue-800 text-xs font-semibold px-1 py-0.5 rounded';
        dur.textContent = this.duration ? `${this.duration} min` : '';
        top.appendChild(left);
        top.appendChild(dur);

        body.appendChild(top);

        // Description area (collapsible)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'sermon-content transition-all duration-300 overflow-hidden text-sm text-gray-700 mb-2';
        contentDiv.style.maxHeight = '3em';
        contentDiv.innerHTML = `<p class="mb-0">${this.description}</p>`;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'text-blue-600 hover:text-blue-800 text-xs mb-2';
        toggleBtn.type = 'button';
        toggleBtn.textContent = 'Show More';

        toggleBtn.addEventListener('click', () => {
            if (contentDiv.style.maxHeight && contentDiv.style.maxHeight !== '3em') {
                contentDiv.style.maxHeight = '1.5em';
                toggleBtn.textContent = 'Show More';
            } else {
                contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
                toggleBtn.textContent = 'Show Less';
            }
        });

        body.appendChild(contentDiv);
        body.appendChild(toggleBtn);

        // Actions (download/pdf)
        const actions = document.createElement('div');
        actions.className = 'flex justify-between items-center';
        const leftActions = document.createElement('div');
        leftActions.className = 'flex space-x-2';
        if (this.audioUrl) {
            const audioBtn = document.createElement('a');
            audioBtn.href = this.audioUrl;
            audioBtn.className = 'text-blue-600 hover:text-blue-800 text-xs flex items-center';
            audioBtn.innerHTML = '<i class="fas fa-download mr-1"></i>MP3';
            leftActions.appendChild(audioBtn);
        }
        if (this.pdfUrl) {
            const pdfLink = document.createElement('a');
            pdfLink.href = this.pdfUrl;
            pdfLink.download = '';
            pdfLink.className = 'text-blue-600 hover:text-blue-800 text-xs flex items-center';
            pdfLink.innerHTML = '<i class="fas fa-file-pdf mr-1"></i>Download';
            leftActions.appendChild(pdfLink);
        }

        actions.appendChild(leftActions);
        body.appendChild(actions);

        card.appendChild(body);

        return card;
    }
}

class SermonManager {
    constructor() {
        this.sermons = [];
        this.initialLimit = 4;
        this.showingAll = false;
    }

    addSermon(sermon) {
        this.sermons.push(sermon);
    }

    clearSermons() {
        this.sermons = [];
    }

    renderSermons(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const sorted = [...this.sermons].sort((a, b) => b.date - a.date);
        const toShow = this.showingAll ? sorted : sorted.slice(0, this.initialLimit);

        toShow.forEach(s => {
            const card = s.createSermonCard();
            container.appendChild(card);
        });

        // remove any existing injected view-all container
        const existing = document.getElementById('view-all-sermons-container');
        if (existing) existing.remove();

        if (!this.showingAll && sorted.length > this.initialLimit) {
            const viewAllWrap = document.createElement('div');
            viewAllWrap.id = 'view-all-sermons-container';
            viewAllWrap.className = 'text-center mt-6';
            const button = document.createElement('button');
            button.id = 'view-all-sermons';
            button.className = 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition inline-flex items-center text-sm';
            button.innerHTML = `<i class="fas fa-list mr-2"></i> View All Sermons (${sorted.length - this.initialLimit} more)`;
            button.addEventListener('click', () => {
                this.showingAll = true;
                this.renderSermons(containerId);
            });
            viewAllWrap.appendChild(button);
            container.parentNode.insertBefore(viewAllWrap, container.nextSibling);
        }
    }

    renderList(containerId, list = []) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        list.forEach(s => container.appendChild(s.createSermonCard()));
        // remove any existing injected view-all container
        const existing = document.getElementById('view-all-sermons-container');
        if (existing) existing.remove();
    }

    searchSermons(query = '', filter = 'all') {
        const q = query.trim().toLowerCase();
        if (!q) return [...this.sermons];
        return this.sermons.filter(s => {
            if (filter === 'title') return s.title.toLowerCase().includes(q);
            if (filter === 'preacher') return s.preacher.toLowerCase().includes(q);
            if (filter === 'date') return s.formatDate().toLowerCase().includes(q) || (s.date && s.date.toISOString().substring(0,10).includes(q));
            // default - search across title, description, preacher, date
            return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.preacher.toLowerCase().includes(q) || s.formatDate().toLowerCase().includes(q);
        });
    }
}

// Utility: try to extract sermon data from existing DOM static cards
function extractSermonsFromDOM(containerSelector = '#sermon-container') {
    const container = document.querySelector(containerSelector);
    if (!container) return [];
    const cards = Array.from(container.querySelectorAll('.sermon-card'));
    const sermons = [];
    cards.forEach(card => {
        try {
            const img = card.querySelector('img');
            const thumbnailUrl = img ? img.src : '';
            const dateSpan = card.querySelector('span.text-sm') || card.querySelector('span.text-xs');
            const dateText = dateSpan ? dateSpan.textContent.trim() : '';
            const titleEl = card.querySelector('h3');
            const title = titleEl ? titleEl.textContent.trim() : '';
            const durationEl = card.querySelector('span.bg-blue-100');
            const duration = durationEl ? durationEl.textContent.replace(/[^0-9]/g, '').trim() : '';
            const descP = card.querySelector('p');
            const description = descP ? descP.textContent.trim() : '';
            // find download/pdf link
            const pdfA = card.querySelector('a[href$=".pdf"]') || card.querySelector('a[download]');
            const pdfUrl = pdfA ? pdfA.href : '';
            // preacher not readily available in static markup - left blank
            const sermonObj = new Sermon({ title, preacher: '', date: dateText, duration, description, thumbnailUrl, pdfUrl });
            sermons.push(sermonObj);
        } catch (e) {
            // skip any card we can't parse
            console.warn('Failed to parse sermon card', e);
        }
    });
    return sermons;
}

// Initialize: replace static cards with OOP-driven small cards and wire search + view all
document.addEventListener('DOMContentLoaded', () => {
    const manager = new SermonManager();
    const extracted = extractSermonsFromDOM('#sermon-container');

    // Default seed data (used when no static DOM cards are present)
    const defaultSermonsData = [
        // {
        //     title: "",
        //     preacher: "",
        //     date: "",
        //     duration: ,
        //     description: "",
        //     thumbnailUrl: "",
        //     pdfUrl: ""
        // },
        {
            title: "BIBLICAL FOUNDATION OF DISCIPLESHIP",
            preacher: "BRO. DR. SUNDAY U. ONAH (SHEPHERD)",
            date: "2025-10-12",
            duration: 45,
            description: "The True Discipleship Transformation, Reformation And Restoration Is Not Merely About Church Attendance, Ritual Worship Services, Fellowship, Friendship,  Relationship,  Companionship,  Partnership,  Workmanship  Or  Titles In  The  Local  Church.  But,  It  Is  A  Practical,  Radical,  Critical,  Crucial  Worship Services, Fellowship, Friendship, Relationship, Companionship, Partnership,Workmanship And Call Of Jesus In Matt. 5:13-16; Matt. 16:24-26 To Be A True Disciple Of Him, By Influencing Our Communities Or Localities With The Soul-Saving  Or  Soul-Searching  Gospel  Of  Our  Lord  Jesus  Christ  In  Fulfilling  The Great Mission And Commission In Matt. 28:18-20; Acts 1:4-8.",
            thumbnailUrl: "/src/Documents/oct,25/BIBLICAL FOUNDATION OF DISCIPLESHIP.jpg",
            pdfUrl: "/src/Documents/oct,25/BIBLICAL FOUNDATION OF DISCIPLESHIP.pdf"
        },
        {
            title: "CHRISTIAN WILDERNESS WANDERING INTO THE PROMISED LAND",
            preacher: "BRO. ICHA INNOCENT (Minister)",
            date: "2025-10-19",
            duration: 40,
            description: "",
            thumbnailUrl: "/src/Documents/oct,25/CHRISTIAN WILDERNESS WANDERING INTO THE PROMISED.jpg",
            pdfUrl: "/src/Documents/oct,25/CHRISTIAN WILDERNESS WANDERING INTO THE PROMISED LAND.pdf"
        },
        {
            title: "TAKE HEED HOW YOU BUILD ON THE FOUNDATION",
            preacher: "BRO. ISAIAH A. ADIKWU (EVANGELIST)",
            date: "2025-10-19",
            duration: 30,
            description: "",
            thumbnailUrl: "/src/Documents/oct,25/TAKE HEED HOW YOU BUILD ON THE FOUNDATION.jpg",
            pdfUrl: "/src/Documents/oct,25/TAKE HEED HOW YOU BUILD ON THE FOUNDATION.pdf"
        },
         {
            title: "THE PECULIAR PEOPLE OF GOD",
            preacher: "BRO. ICHA INNOCENT (Minister)",
            date: "2025-10-12",
            duration: 30,
            description: "",
            thumbnailUrl: "/src/Documents/oct,25/THE PECULIAR PEOPLE OF GOD.jpg",
            pdfUrl: "/src/Documents/oct,25/THE PECULIAR PEOPLE OF GOD.pdf"
        },
        {
            title: "WHO ARE YOU?",
            preacher: "BRO. ICHA INNOCENT (Minister)",
            date: "2025-10-05",
            duration: 30,
            description: "",
            thumbnailUrl: "/src/Documents/oct,25/WHO ARE YOU.jpg",
            pdfUrl: "/src/Documents/oct,25/WHO ARE YOU.pdf"
        },
        {
            title: "THE ACTIVITIES OF WIDOWS IN THE OLD AND NEW TESTAMENTS OF THE BIBLE",
            preacher: "BRO. DR. SUNDAY U. ONAH",
            date: "2025-10-05",
            duration: 40,
            description: "",
            thumbnailUrl: "/src/Documents/oct,25/THE_ACTIVITIES_OF_WIDOWS.jpg",
            pdfUrl: "/src/Documents/oct,25/THE_ACTIVITIES_OF_WIDOWS.pdf"
        },
        {
            title: "THE PRACTICAL NEW TESTAMENT WISDOM AND INTEGRITY IN THE FACE OF FOOLISHNESS",
            preacher: "Bro. Dr. Sunday U. Onah",
            date: "2025-07-20",
            duration: 40,
            description: "Bro. Dr. Sunday U. Onah (Shepherd) teaches about genuine and active faith in God's will which produces good works; as Faith And Works Go Together; While Faith And Fear Works Against Each Other Through Pride. But, Humility And Obedience Works Together To Bring About The Practical New Testament Christianity And Religion.",
            thumbnailUrl: "/src/Documents/20th July, 2025/teaching.jpg",
            pdfUrl: "/src/Documents/20th July, 2025/WISDOM AND INTEGRITY IN THE FACE OF FOOLISHNESS.pdf"
        },
        {
            title: "STAND AT THE CROSS ROADS, LOOK, ASK FOR THE ANCIENT PATHS",
            preacher: "Bro. Eno B. Essien",
            date: "2025-07-20",
            duration: 30,
            description: "Bro. Eno B. Essien (Shepherd) in this sermon edified Christians that if only they heed the command to ask for the ancient paths and walk thereby, eternal rest with Him in Heaven is the final promise to all who truly believe and follow to the end.",
            thumbnailUrl: "/src/Documents/20th July, 2025/sermon.jpg",
            pdfUrl: "/src/Documents/20th July, 2025/STAND AT THE CROSS ROADS.pdf"
        },
        {
            title: "HUMILITY AND OBEDIENCE IN THE FACE OF HASTY",
            preacher: "Bro. Dr. Sunday U. Onah",
            date: "2025-07-13",
            duration: 40,
            description: "Bro. Dr. Sunday U. Onah (Shepherd) teaches about genuine and active faith in God's will which produces good works; as a central theme of James' letter, around which He supplies practical advice on living and practicing the Christian faith and life; a continuation of his previous lesson Humility & Obedience In The Face Of Pride.",
            thumbnailUrl: "/src/Documents/Sunday 13th July,2025/teaching.jpg",
            pdfUrl: "/src/Documents/Sunday 13th July,2025/HUMILITY AND OBEDIENCE IN THE FACE OF HASTY.pdf"
        },
        {
            title: "KINGDOM INVESTMENT",
            preacher: "Bro. Isaiah Adikwu",
            date: "2025-07-13",
            duration: 30,
            description: "Bro. Isaiah Adikwu (Evangelist) in this episode reminded Christians of the ultimate investment they can ever have.",
            thumbnailUrl: "/src/Documents/Sunday 13th July,2025/sermon.jpg",
            pdfUrl: "/src/Documents/Sunday 13th July,2025/KINGDOM INVESTMENTS.pdf"
        },
        {
            title: "HUMILITY AND OBEDIENCE IN THE FACE OF PRIDE",
            preacher: "Bro. Dr. Sunday U. Onah",
            date: "2025-07-06",
            duration: 40,
            description: "Bro. Dr. Sunday U. Onah (Shepherd) teaches about genuine and active faith in God's will which produces good works; as a central theme of James' letter, around which He supplies practical advice on living and practicing the Christian faith and life.",
            thumbnailUrl: "/src/Documents/6th July, 2025/teaching.jpg",
            pdfUrl: "/src/Documents/6th July, 2025/HUMILITY AND OBEDIENCE IN THE FACE OF PRIDE.pdf"
        },
        {
            title: "WHERE ARE YOU IN TIME OF TROUBLE?",
            preacher: "Bro. Musa Ogiri",
            date: "2025-07-06",
            duration: 30,
            description: "Bro. Musa Ogiri (Deacon) encourages Christians who proclaim the name of our Jesus Christ to hold unto Christ who is the author and finisher of our faith in times of trouble.",
            thumbnailUrl: "/src/Documents/6th July, 2025/sermon.jpg",
            pdfUrl: "/src/Documents/6th July, 2025/SERMON PREPARED AND DELIVERED DURING SUNDAY MORNING WORSHIP SERVICE AT CHURCH OF CHRIST.pdf"
        },
        {
            title: "SUBMITTING & HUMBLING YOURSELVES TO ONE ANOTHER IN THE FEAR OF THE LORD",
            preacher: "Bro. Dr. Sunday U. Onah",
            date: "2025-06-29",
            duration: 40,
            description: "Dr. Bro. Sunday U. Onah (Shepherd) teaches about Submission As A Voluntary Placement Of Oneself Under The Authority, Dominion, Leadership And Lordship Of One Another As Commanded By God.",
            thumbnailUrl: "/src/Documents/sunday 29th june/teaching.jpg",
            pdfUrl: "/src/Documents/sunday 29th june/SUBMIT YOURSELVES TO ONE ANOTHER.pdf"
        },
        {
            title: "GOD HAS A PURPOSE FOR YOU",
            preacher: "Bro. Effiong Sunday",
            date: "2025-06-29",
            duration: 30,
            description: "Bro. Effiong Sunday encourages Christian who proclaim the name of our Jesus Christ to hold onto the sound Gospel; which only by so doing can he or she grow unto the maturity expected of us by Christ.",
            thumbnailUrl: "/src/Documents/sunday 29th june/sermon.jpg",
            pdfUrl: "/src/Documents/sunday 29th june/GOD HAS A PURPOSE FOR YOU.pdf"
        },
        {
            title: "A FRUIT BEARING CHRISTIAN IN THE VINEYARD OF THE LORD",
            preacher: "Bro. Sunday U. Onah",
            date: "2025-06-22",
            duration: 35,
            description: "Bro. Sunday U. Onah explores what it truly means to walk by faith in our daily lives.",
            thumbnailUrl: "/src/Documents/Sunday 22nd June, 25/TEACHING THUMBNAIL 22ND JUNE, 2025.jpg",
            pdfUrl: "/src/Documents/Sunday 22nd June, 25/A_FRUIT_BEARING_CHRISTIAN_IN_THE_VINEYARD_OF_THE_LORD..pdf"
        }
    ];

    const seed = extracted.length ? extracted : defaultSermonsData.map(d => new Sermon(d));

    manager.clearSermons();
    seed.forEach(s => manager.addSermon(s));

    // remove existing static "View All" anchor(s)
    Array.from(document.querySelectorAll('a')).forEach(a => {
        if (a.textContent && a.textContent.toLowerCase().includes('view all sermons')) {
            a.remove();
        }
    });
    // render compact cards
    manager.renderSermons('sermon-container');

    // wire search input
    const searchInput = document.getElementById('sermon-search');
    if (searchInput) {
        let timer;
        searchInput.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const q = searchInput.value.trim();
                if (!q) {
                    // restore default rendering
                    manager.showingAll = false;
                    manager.renderSermons('sermon-container');
                    return;
                }
                const results = manager.searchSermons(q, 'all');
                manager.renderList('sermon-container', results);
            }, 150);
        });
    }
});
