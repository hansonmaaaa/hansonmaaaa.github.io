// Smooth scroll and active nav link highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

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
  contact: 'bg-white',
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

// Animate gradient circles as you scroll, moving parallel to boxes and bottom circles fade in as top ones fade out
const getBoxY = () => {
  // Try to find the first .detail-box in the .experience section as a reference
  const box = document.querySelector('#experience .detail-box');
  if (box) {
    const rect = box.getBoundingClientRect();
    return rect.top + window.scrollY;
  }
  return window.innerHeight * 0.5;
};

const circles = [
  { el: document.querySelector('.circle-light-blue'), x: -320, y: 10, xRange: 80, yRange: 20, dir: 1 },
  { el: document.querySelector('.circle-light-blue2'), x: 0, y: 65, xRange: 120, yRange: 30, dir: -1 },
  { el: document.querySelector('.circle-white'), x: 0, y: 5, xRange: 100, yRange: 25, dir: 1 },
  { el: document.querySelector('.circle-white2'), x: -400, y: 80, xRange: 150, yRange: 40, dir: -1 },
];

const bottomCircles = [
  { el: document.querySelector('.circle-bottom-light-blue'), x: 60, y: 100, xRange: 40, yRange: 10, dir: 1 },
  { el: document.querySelector('.circle-bottom-white'), x: 50, y: 110, xRange: 60, yRange: 15, dir: -1 },
];

// Store current positions for smooth interpolation
const circleStates = circles.concat(bottomCircles).map((c) => ({
  el: c.el,
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  xRange: c.xRange,
  yRange: c.yRange,
  dir: c.dir,
  baseX: c.x,
  baseY: c.y,
}));

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function animateCircles() {
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollNorm = docHeight > 0 ? scrollY / docHeight : 0;
  const boxY = getBoxY();
  const boxNorm = Math.min(1, Math.max(0, (scrollY + window.innerHeight / 2 - boxY) / window.innerHeight));

  // Animate top and bottom circles
  circleStates.forEach((c, i) => {
    if (!c.el) return;
    const angle = scrollNorm * Math.PI * 2 + i * Math.PI / 2;
    // Calculate target positions
    if (i < circles.length) {
      // Top circles
      c.targetX = Math.sin(angle * c.dir) * c.xRange;
      c.targetY = (boxY - window.innerHeight * 0.5) * 0.15 + Math.cos(angle * c.dir) * c.yRange;
      c.el.style.opacity = 1 - boxNorm * 1.2;
    } else {
      // Bottom circles
      c.targetX = Math.sin(angle * c.dir) * c.xRange;
      c.targetY = Math.cos(angle * c.dir) * c.yRange;
      c.el.style.opacity = Math.max(0, boxNorm * 1.2);
    }
    // Smoothly interpolate current position towards target
    c.x = lerp(c.x, c.targetX, 0.12);
    c.y = lerp(c.y, c.targetY, 0.12);
    c.el.classList.add('animated');
    c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
  });
  requestAnimationFrame(animateCircles);
}
requestAnimationFrame(animateCircles);

// CSS for fade-section and visible will be in style.css:
// .fade-section { opacity: 0; transform: translateY(40px); transition: opacity 0.8s, transform 0.8s; }
// .fade-section.visible { opacity: 1; transform: translateY(0); } 