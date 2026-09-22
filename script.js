const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const slides = document.querySelector('.slides');
const slideCurrent = document.querySelector('.slide-current');
const slideCount = document.querySelectorAll('.slide').length;
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slideCount) % slideCount;
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  slideCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
}

document.querySelector('.next').addEventListener('click', () => showSlide(currentSlide + 1));
document.querySelector('.previous').addEventListener('click', () => showSlide(currentSlide - 1));

let slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
const sliderWindow = document.querySelector('.slider-window');
sliderWindow.addEventListener('mouseenter', () => clearInterval(slideshowTimer));
sliderWindow.addEventListener('mouseleave', () => {
  slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
});

document.querySelector('#registration-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const fullName = form.elements.fullname.value.trim();
  const name = fullName.split(' ')[0];
  const email = form.elements.email.value.trim();
  const whatsapp = form.elements.whatsapp.value.trim();
  const address = form.elements.address.value.trim();
  const course = form.elements.course.value;
  const experience = form.elements.experience.value;
  const success = form.querySelector('.form-success');
  const adminWhatsApp = '2349049425932';
  const studentWhatsApp = whatsapp.replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^0/, '234');
  const registrationMessage = `New CreateX Tech webinar waitlist registration\n\nFull name: ${fullName}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nHome address: ${address}\nCourse: ${course}\nExperience: ${experience}`;
  const studentMessage = `🎉 Congratulations!\n\nYou have successfully completed your registration for the ${course} webinar waitlist.\n\nThank you for your interest in joining us. We’ll keep you updated with important information, including the webinar date, time, access details, and any other announcements.\n\nWe look forward to having you with us! 🎓✨\n\nStay tuned and get ready to learn, connect, and grow!`;
  const adminWhatsAppLink = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(registrationMessage)}`;
  const studentWhatsAppLink = `https://wa.me/${studentWhatsApp}?text=${encodeURIComponent(studentMessage)}`;
  const subject = encodeURIComponent('CreateX Tech waitlist confirmation');
  const body = encodeURIComponent(`Hi ${name || 'there'},\n\nThanks for joining the CreateX Tech waitlist for ${course}. We have received your registration and will contact you with the next cohort details.\n\nCreateX Tech`);
  window.open(adminWhatsAppLink, '_blank', 'noopener');
  success.innerHTML = `Thanks, ${name || 'there'}! Your ${course} registration is ready. <a href="${adminWhatsAppLink}" target="_blank" rel="noopener">Send registration to CreateX Tech WhatsApp</a> <a href="${studentWhatsAppLink}" target="_blank" rel="noopener">Open your WhatsApp confirmation</a> <a href="mailto:${email}?subject=${subject}&body=${body}">Open email confirmation</a>`;
  form.reset();
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a:not(.nav-cta)');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => observer.observe(section));

const mentorProfiles = [
  {
    name: 'Mr. Adesanwo Ambrose Oreoluwa',
    role: 'Coding Tutor · Frontend / Backend',
    bio: 'A frontend and backend expert with lots of successful projects.',
    initials: 'AO',
    image: 'images/mentors/mentor-two.jpg'
  },
  {
    name: 'Mr. Sanni Arafat Mohammed',
    role: 'Forex Trading / Coding Tutor',
    bio: 'A frontend and backend expert with lots of successful projects and experience working in known enterprises. He also holds a certificate in crypto trading.',
    initials: 'SA',
    image: 'images/mentors/mentor-three.jpg'
  },
  {
    name: 'Mr. Musbaudeen Fathiu Bodunrin',
    role: 'Forex Trading / Frontend Tutor',
    bio: 'A frontend expert with successful projects who also holds a certificate in crypto trading.',
    initials: 'MF',
    image: 'images/mentors/mentor-four.jpg'
  },
  {
    name: 'Mr. Hassan Ridwan (Maxam)',
    role: 'Professional Graphic Designer',
    bio: 'A professional graphic designer, print manager, creative expert, and colour mix expert with a successful record in the graphic industry.',
    initials: 'HR',
    image: 'images/mentors/mentor-five.jpg'
  }
];

document.querySelectorAll('.mentor-card:not(.mentor-featured)').forEach((card, index) => {
  const mentor = mentorProfiles[index];
  if (!mentor) return;
  const photo = card.querySelector('.mentor-photo');
  const image = card.querySelector('img');
  const details = card.querySelector('.mentor-details');
  image.src = mentor.image;
  image.alt = `Photo of ${mentor.name}`;
  image.addEventListener('error', () => { image.style.display = 'none'; });
  photo.querySelector('span').textContent = mentor.initials;
  details.querySelector('.mentor-role').textContent = mentor.role;
  details.querySelector('h3').textContent = mentor.name;
  details.querySelector('p:last-child').textContent = mentor.bio;
});
