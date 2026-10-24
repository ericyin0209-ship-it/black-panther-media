const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
const progress = document.querySelector('.reading-progress span');
let scrollQueued = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
  scrollQueued = false;
}
addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, {passive: true});
addEventListener('resize', updateProgress);
updateProgress();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, {rootMargin: '-15% 0px -65% 0px', threshold: 0});
  ['perspective','culture','gender','questions','sources'].forEach(id => observer.observe(document.getElementById(id)));
}
document.getElementById('print-page').addEventListener('click', () => window.print());
let detailsBeforePrint = [];
addEventListener('beforeprint', () => {
  detailsBeforePrint = [...document.querySelectorAll('details')].map(element => [element, element.open]);
  detailsBeforePrint.forEach(([element]) => {element.open = true;});
});
addEventListener('afterprint', () => detailsBeforePrint.forEach(([element, open]) => {element.open = open;}));
