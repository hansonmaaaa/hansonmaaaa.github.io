// Smooth scroll and active nav link highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const footerSection = document.querySelector('.footer-section');

// Scroll to section on nav click
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Improved nav highlight using IntersectionObserver
const navMap = {};
navLinks.forEach(link => {
  const id = link.getAttribute('href').replace('#', '');
  navMap[id] = link;
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all
      navLinks.forEach(link => link.classList.remove('active'));
      // Add active to current
      const id = entry.target.getAttribute('id');
      if (navMap[id]) navMap[id].classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => {
  sectionObserver.observe(section);
});
if (footerSection) {
  sectionObserver.observe(footerSection);
}

// Ensure page starts at the top
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Alternate background between light blue and white
const sectionBgMap = {
  home: 'bg-light-blue',
  education: 'bg-white',
  experience: 'bg-light-blue',
  projects: 'bg-white',
  skills: 'bg-light-blue',
  aiChat: 'bg-white',
  contact: 'bg-light-blue',
};

const body = document.body;

const bgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove all bg classes
      Object.values(sectionBgMap).forEach(cls => body.classList.remove(cls));
      // Add the new bg class
      const id = entry.target.getAttribute('id');
      if (sectionBgMap[id]) body.classList.add(sectionBgMap[id]);
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => {
  bgObserver.observe(section);
});
if (footerSection) {
  bgObserver.observe(footerSection);
}