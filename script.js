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
	const email = form.elements.email.value.trim();
	const whatsapp = form.elements.whatsapp.value.trim();
	const address = form.elements.address.value.trim();
	const course = form.elements.course.value;
	const experience = form.elements.experience.value;
	const success = form.querySelector('.form-success');
	const registrations = JSON.parse(localStorage.getItem('createXRegistrations') || '[]');
	registrations.push({
		id: Date.now(),
		fullName,
		email,
		whatsapp,
		address,
		course,
		experience,
		registeredAt: new Date().toISOString()
	});
	localStorage.setItem('createXRegistrations', JSON.stringify(registrations));
	const createXTechWhatsApp = '09049425932'.replace(/^0/, '234');
	const registrationMessage = `New CreateX Tech webinar waitlist registration\n\nFull name: ${fullName}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nHome address: ${address}\nCourse: ${course}\nExperience: ${experience}`;
	const whatsappLink = `https://wa.me/${createXTechWhatsApp}?text=${encodeURIComponent(registrationMessage)}`;

	window.open(whatsappLink, '_blank', 'noopener');
	success.innerHTML = `Your registration is ready. <a href="${whatsappLink}" target="_blank" rel="noopener">Send form to 09049425932 on WhatsApp</a>`;
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
