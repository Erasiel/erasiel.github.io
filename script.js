/* ============================================================
   Mobile navigation toggle
   ============================================================ */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

/* ============================================================
   Active nav link highlighting on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: '-45% 0px -50% 0px'
});

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   Publications: load from JSON, render, then wire up pill filter
   ============================================================ */
const LINK_ICONS = {
  paper:   'fa-solid fa-book-open',
  code:    'fa-brands fa-github',
  dataset: 'fa-solid fa-database',
  poster:  'fa-solid fa-image',
  slides:  'fa-solid fa-desktop',
  video:   'fa-brands fa-youtube',
  project: 'fa-solid fa-globe',
  arxiv:   'fa-solid fa-file-lines',
};

function buildPubCard(paper, isHighlighted) {
  const article = document.createElement('article');
  article.className = 'pub-card' + (isHighlighted ? ' pub-highlighted' : '');

  const meta = document.createElement('div');
  meta.className = 'pub-meta';

  const venueSpan = document.createElement('span');
  venueSpan.className = `pub-venue venue-${paper.venue.type}`;
  venueSpan.textContent = paper.venue.label;
  meta.appendChild(venueSpan);

  if (paper.award) {
    const awardSpan = document.createElement('span');
    awardSpan.className = 'pub-award';
    awardSpan.innerHTML = `<i class="fa-solid fa-award"></i> ${paper.award}`;
    meta.appendChild(awardSpan);
  }
  article.appendChild(meta);

  const titleH3 = document.createElement('h3');
  titleH3.className = 'pub-title';
  const paperUrl = paper.links.find(l => l.type === 'paper')?.url ?? '#';
  titleH3.innerHTML = `<a href="${paperUrl}">${paper.title}</a>`;
  article.appendChild(titleH3);

  const authorsP = document.createElement('p');
  authorsP.className = 'pub-authors';
  authorsP.innerHTML = paper.authors
    .map(a => a === paper.highlightedAuthor ? `<strong>${a}</strong>` : a)
    .join(', ');
  article.appendChild(authorsP);

  const linksDiv = document.createElement('div');
  linksDiv.className = 'pub-links';

  paper.links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'pub-link';
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `<i class="${LINK_ICONS[link.type] ?? 'fa-solid fa-link'}"></i> ${link.label}`;
    linksDiv.appendChild(a);
  });

  if (paper.bibtex) {
    const citeBtn = document.createElement('button');
    citeBtn.type = 'button';
    citeBtn.className = 'pub-link cite-btn';
    citeBtn.dataset.bibtex = paper.bibtex;
    citeBtn.innerHTML = '<i class="fa-solid fa-quote-right"></i> Cite';
    linksDiv.appendChild(citeBtn);
  }

  article.appendChild(linksDiv);
  return article;
}

function renderPublications(papers) {
  const pubSelected = document.getElementById('pubSelected');
  const pubAll      = document.getElementById('pubAll');

  // Selected: highlighted papers only
  papers
    .filter(p => p.highlighted)
    .forEach(p => pubSelected.appendChild(buildPubCard(p, false)));

  // All: grouped by year, highlighted papers get accent border
  const byYear = papers.reduce((acc, p) => {
    (acc[p.year] = acc[p.year] ?? []).push(p);
    return acc;
  }, {});

  Object.keys(byYear)
    .sort((a, b) => b - a)
    .forEach(year => {
      const label = document.createElement('div');
      label.className = 'pub-year-label';
      label.textContent = year;
      pubAll.appendChild(label);
      byYear[year].forEach(p => pubAll.appendChild(buildPubCard(p, p.highlighted)));
    });

  // Wire up pill filter now that containers are populated
  const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
  pubFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pubFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const showAll = btn.dataset.target === 'all';
      pubSelected.hidden = showAll;
      pubAll.hidden = !showAll;
    });
  });
}

fetch('resources/publications.json')
  .then(r => r.json())
  .then(renderPublications)
  .catch(err => console.error('Could not load resources/publications.json:', err));

/* ============================================================
   BibTeX citation modal
   ============================================================ */
const citeModal   = document.getElementById('citeModal');
const citeCode    = document.getElementById('citeModalCode');
const citeClose   = document.getElementById('citeModalClose');
const citeCopyBtn = document.getElementById('citeCopyBtn');

function openCiteModal(bibtex) {
  citeCode.textContent = bibtex.trim();
  citeModal.hidden = false;
  document.body.style.overflow = 'hidden';
  citeClose.focus();
}

function closeCiteModal() {
  citeModal.hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.cite-btn');
  if (btn) openCiteModal(btn.dataset.bibtex);
});

citeClose.addEventListener('click', closeCiteModal);
citeModal.querySelector('.cite-modal-backdrop').addEventListener('click', closeCiteModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !citeModal.hidden) closeCiteModal();
});

citeCopyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(citeCode.textContent).then(() => {
    citeCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    citeCopyBtn.classList.add('copied');
    setTimeout(() => {
      citeCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      citeCopyBtn.classList.remove('copied');
    }, 2000);
  });
});
