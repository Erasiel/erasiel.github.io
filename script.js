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
   Publications: pill filter — swap between selected and full list
   ============================================================ */
const pubFilterBtns = document.querySelectorAll('.pub-filter-btn');
const pubSelected   = document.getElementById('pubSelected');
const pubAll        = document.getElementById('pubAll');

pubFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pubFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const showAll = btn.dataset.target === 'all';
    pubSelected.hidden = showAll;
    pubAll.hidden = !showAll;
  });
});

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
