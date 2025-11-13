// Import default sermon data
import { defaultSermonsData } from './updateSermonData.js';

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
        contentDiv.className = 'sermon-content transition-all duration-300 overflow-hidden text-base text-black-900 mb-2 font-medium';

        // inner wrapper holds the actual text so measurements are consistent
        const contentInner = document.createElement('div');
        contentInner.innerHTML = `<p class="mb-0">${this.description}</p>`;
        contentDiv.appendChild(contentInner);

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'text-blue-600 hover:text-blue-800 text-xs mb-2';
        toggleBtn.type = 'button';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = 'Show More';

        // We'll compute the collapsed height when the card is inserted into the DOM.
        // Attach an initializer function to the card so the manager can call it after appendChild.
        card._initToggle = function() {
            // number of lines to show when collapsed
            const lines = 2;
            // compute line-height from the first paragraph
            const p = contentInner.querySelector('p');
            const cs = window.getComputedStyle(p);
            const lineHeight = parseFloat(cs.lineHeight) || parseFloat(window.getComputedStyle(contentInner).fontSize) * 1.2;
            const collapsedHeight = Math.ceil(lineHeight * lines);

            // ensure natural height is measurable by forcing auto height briefly
            contentDiv.style.maxHeight = 'none';
            const fullHeight = contentDiv.scrollHeight;

            if (fullHeight <= collapsedHeight + 4) {
                // content fits in collapsed area — no toggle needed
                toggleBtn.style.display = 'none';
                contentDiv.style.maxHeight = 'none';
                contentDiv.classList.remove('overflow-hidden');
                toggleBtn.setAttribute('aria-hidden', 'true');
            } else {
                // set collapsed height and show toggle
                contentDiv.style.maxHeight = `${collapsedHeight}px`;
                toggleBtn.style.display = '';
                toggleBtn.setAttribute('aria-hidden', 'false');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        };

        let isExpanded = false;
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isExpanded = !isExpanded;
            if (isExpanded) {
                // expand to full height (use scrollHeight so it animates)
                contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
                toggleBtn.textContent = 'Show Less';
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                // collapse back to the computed collapsed height
                // recompute collapsed height in case responsive change occurred
                const p = contentInner.querySelector('p');
                const cs = window.getComputedStyle(p);
                const lineHeight = parseFloat(cs.lineHeight) || parseFloat(window.getComputedStyle(contentInner).fontSize) * 1.2;
                const collapsedHeight = Math.ceil(lineHeight * 3);
                contentDiv.style.maxHeight = `${collapsedHeight}px`;
                toggleBtn.textContent = 'Show More';
                toggleBtn.setAttribute('aria-expanded', 'false');
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
            // initialize toggle after the card is in the DOM so measurements (scrollHeight) work
            if (typeof card._initToggle === 'function') {
                try { card._initToggle(); } catch (e) { /* ignore init errors */ }
            }
        });

        // remove any existing injected view-all container
        const existing = document.getElementById('view-all-sermons-container');
        if (existing) existing.remove();

        // If there are more sermons than the initial limit, show a toggle button
        if (sorted.length > this.initialLimit) {
            const viewAllWrap = document.createElement('div');
            viewAllWrap.id = 'view-all-sermons-container';
            viewAllWrap.className = 'text-center mt-6';
            const button = document.createElement('button');
            button.id = 'view-all-sermons';
            button.className = 'bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition inline-flex items-center text-sm';

            const remaining = Math.max(0, sorted.length - this.initialLimit);
            if (this.showingAll) {
                button.innerHTML = `<i class="fas fa-compress mr-2"></i> View Less`;
            } else {
                button.innerHTML = `<i class="fas fa-list mr-2"></i> View All Sermons (${remaining} more)`;
            }

            button.addEventListener('click', () => {
                // toggle between showing all and restoring to initialLimit
                this.showingAll = !this.showingAll;
                this.renderSermons(containerId);
                // if collapsing, scroll back to the container to keep context
                if (!this.showingAll) {
                    const parent = document.getElementById(containerId);
                    if (parent) parent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            viewAllWrap.appendChild(button);
            container.parentNode.insertBefore(viewAllWrap, container.nextSibling);
        }
    }

    renderList(containerId, list = []) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        list.forEach(s => {
            const c = s.createSermonCard();
            container.appendChild(c);
            if (typeof c._initToggle === 'function') {
                try { c._initToggle(); } catch (e) { /* ignore */ }
            }
        });
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

    // Seed data is now imported from updateSermonData.js at the top of this file

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

        // Recompute collapsed heights on window resize (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // For each rendered card, re-run its init function only if it's currently collapsed
                document.querySelectorAll('.sermon-card').forEach(card => {
                    try {
                        const toggle = card.querySelector('button[aria-expanded]');
                        if (toggle && toggle.getAttribute('aria-expanded') === 'false' && typeof card._initToggle === 'function') {
                            card._initToggle();
                        }
                    } catch (e) { /* ignore */ }
                });
            }, 150);
        });
});
