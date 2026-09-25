const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const adminAccessTrigger = document.querySelector('#admin-access');
const adminLoginPanel = document.querySelector('#login-panel');
const adminDashboard = document.querySelector('#dashboard');
const recordsBody = document.querySelector('#records-body');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const courseFilter = document.querySelector('#course-filter');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const adminPassword = 'CreateXAdmin2026!';

function getRegistrations() {
	return JSON.parse(localStorage.getItem('createXRegistrations') || '[]');
}

function formatDate(value) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function renderAdminTable() {
	if (!recordsBody || !emptyState || !searchInput || !courseFilter) return;

	const registrations = getRegistrations();
	const query = searchInput.value.trim().toLowerCase();
	const selectedCourse = courseFilter.value;
	const filtered = registrations.filter((registration) => {
		const matchesQuery = [registration.fullName, registration.email, registration.course].some((value) => value.toLowerCase().includes(query));
		return matchesQuery && (selectedCourse === 'all' || registration.course === selectedCourse);
	}).sort((first, second) => second.id - first.id);

	recordsBody.replaceChildren();
	filtered.forEach((registration) => {
		const row = document.createElement('tr');
		row.innerHTML = '<td><strong></strong></td><td><a class="email-link"></a><small class="phone"></small></td><td><span class="course-tag"></span></td><td></td><td></td><td></td><td><button class="delete-button" type="button">×</button></td>';
		row.querySelector('strong').textContent = registration.fullName;
		row.querySelector('.email-link').textContent = registration.email;
		row.querySelector('.email-link').href = `mailto:${registration.email}`;
		row.querySelector('.phone').textContent = registration.whatsapp;
		row.querySelector('.course-tag').textContent = registration.course;
		row.cells[3].textContent = registration.experience;
		row.cells[4].textContent = registration.address;
		row.cells[5].textContent = formatDate(registration.registeredAt);
		row.querySelector('.delete-button').setAttribute('aria-label', `Delete registration for ${registration.fullName}`);
		row.querySelector('.delete-button').addEventListener('click', () => {
			localStorage.setItem('createXRegistrations', JSON.stringify(getRegistrations().filter((item) => item.id !== registration.id)));
			renderAdminTable();
		});
		recordsBody.append(row);
	});

	emptyState.hidden = filtered.length > 0;
	document.querySelector('#total-count').textContent = String(registrations.length);
	document.querySelector('#latest-date').textContent = registrations.length ? formatDate(new Date(Math.max(...registrations.map((item) => item.id)))) : '—';

	const courseCounts = registrations.reduce((counts, item) => ({ ...counts, [item.course]: (counts[item.course] || 0) + 1 }), {});
	document.querySelector('#popular-course').textContent = Object.keys(courseCounts).sort((a, b) => courseCounts[b] - courseCounts[a])[0] || '—';
}

function exportAdminCsv() {
	const registrations = getRegistrations();
	if (!registrations.length) return;
	const headers = ['Full name', 'Email', 'WhatsApp', 'Address', 'Course', 'Experience', 'Registered at'];
	const rows = registrations.map((item) => [item.fullName, item.email, item.whatsapp, item.address, item.course, item.experience, item.registeredAt]);
	const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
	const link = document.createElement('a');
	link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
	link.download = 'createx-student-registrations.csv';
	link.click();
}

function showAdminDashboard() {
	if (!adminLoginPanel || !adminDashboard) return;
	adminLoginPanel.hidden = true;
	adminDashboard.hidden = false;
	searchInput.addEventListener('input', renderAdminTable);
	courseFilter.addEventListener('change', renderAdminTable);
	document.querySelector('#export-button').addEventListener('click', exportAdminCsv);
	document.querySelector('#clear-button').addEventListener('click', () => {
		if (getRegistrations().length && window.confirm('Delete all student registrations from this browser?')) {
			localStorage.removeItem('createXRegistrations');
			renderAdminTable();
		}
	});
	renderAdminTable();
}

if (adminAccessTrigger) {
	adminAccessTrigger.addEventListener('click', () => {
		if (!adminLoginPanel) return;
		adminLoginPanel.hidden = false;
		adminLoginPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
		const passwordField = document.querySelector('#admin-password');
		if (passwordField) passwordField.focus();
	});
}

if (loginForm) {
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault();
		if (loginForm.elements['admin-password'].value !== adminPassword) {
			loginError.hidden = false;
			return;
		}
		sessionStorage.setItem('createXAdminAuthenticated', 'true');
		showAdminDashboard();
	});
}

if (sessionStorage.getItem('createXAdminAuthenticated') === 'true') showAdminDashboard();

if (menuToggle && siteNav) {
	menuToggle.addEventListener('click', () => {
		const isOpen = siteNav.classList.toggle('open');
		menuToggle.setAttribute('aria-expanded', String(isOpen));
	});
}

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
	if (!slides || !slideCurrent || !slideCount) return;
	currentSlide = (index + slideCount) % slideCount;
	slides.style.transform = `translateX(-${currentSlide * 100}%)`;
	slideCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
}

const nextButton = document.querySelector('.next');
const previousButton = document.querySelector('.previous');

if (nextButton) nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
if (previousButton) previousButton.addEventListener('click', () => showSlide(currentSlide - 1));

let slideshowTimer = null;
const sliderWindow = document.querySelector('.slider-window');

if (slides && slideCurrent && slideCount) {
	slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
	if (sliderWindow) {
		sliderWindow.addEventListener('mouseenter', () => clearInterval(slideshowTimer));
		sliderWindow.addEventListener('mouseleave', () => {
			slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
		});
	}
}

const registrationForm = document.querySelector('#registration-form');

if (registrationForm) {
	registrationForm.addEventListener('submit', (event) => {
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
}

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
		bio: 'A frontend and backend developer who turns complex ideas into clear, useful digital products. He enjoys helping beginners build strong foundations and guiding learners through projects they can confidently show.',
		initials: 'AO',
		image: 'images/mentors/adesanwo ambrose.png'
	},
	{
		name: 'Mr. Sanni Arafat Mohammed',
		role: 'Forex Trading / Coding Tutor',
		bio: 'A practical technology tutor with experience across frontend development, backend systems, and digital assets. He teaches learners to think clearly, manage risk, and turn technical knowledge into useful projects.',
		initials: 'SA',
		image: 'images/mentors/sanni arafat.png'
	},
	{
		name: 'Mr. Musbaudeen Fathiu Bodunrin',
		role: 'Forex Trading / Frontend Tutor',
		bio: 'A frontend expert with successful projects who also holds a certificate in crypto trading.',
		initials: 'MF',
		image: 'images/mentors/bodunrin.jpeg'
	},
	{
		name: 'Mr. Hassan Ridwan (Maxam)',
		role: 'Professional Graphic Designer',
		bio: 'A professional graphic designer, print manager, creative expert, and colour mix expert with a successful record in the graphic industry.',
		initials: 'HR',
		image: 'images/mentors/maxam.jpeg'
	}
];

const featuredImage = document.querySelector('.mentor-featured .mentor-photo img');
if (featuredImage) {
	featuredImage.src = 'images/mentors/mohammed jamiu.jpeg';
	featuredImage.style.display = '';
}

document.querySelectorAll('.mentor-card:not(.mentor-featured)').forEach((card, index) => {
	const mentor = mentorProfiles[index];
	if (!mentor) return;
	const photo = card.querySelector('.mentor-photo');
	const image = card.querySelector('img');
	const details = card.querySelector('.mentor-details');
	if (mentor.image) {
		image.src = mentor.image;
		image.style.display = '';
		photo.classList.remove('mentor-photo--placeholder');
		photo.removeAttribute('data-placeholder');
		image.alt = `Photo of ${mentor.name}`;
		image.addEventListener('error', () => { image.style.display = 'none'; });
	} else {
		image.style.display = 'none';
		photo.classList.add('mentor-photo--placeholder');
		photo.dataset.placeholder = 'Image coming soon';
	}
	photo.querySelector('span').textContent = mentor.initials;
	details.querySelector('.mentor-role').textContent = mentor.role;
	details.querySelector('h3').textContent = mentor.name;
	details.querySelector('p:last-child').textContent = mentor.bio;
});

document.querySelectorAll('.mentor-details').forEach((details) => {
	const badge = document.createElement('div');
	badge.className = 'mentor-verification';
	badge.innerHTML = '<img src="images/trusted-certified.png" alt=""> <span>Verified &amp; certified mentor</span>';
	details.append(badge);
});

const mentorDialog = document.createElement('dialog');
mentorDialog.className = 'mentor-dialog';
mentorDialog.innerHTML = '<div class="mentor-dialog-content"><button class="mentor-dialog-close" type="button" aria-label="Close biography">×</button><p class="mentor-role"></p><h2></h2><p class="mentor-dialog-bio"></p></div>';
document.body.append(mentorDialog);

const closeMentorDialog = () => mentorDialog.close();
mentorDialog.querySelector('.mentor-dialog-close').addEventListener('click', closeMentorDialog);
mentorDialog.addEventListener('click', (event) => {
	if (event.target === mentorDialog) closeMentorDialog();
});

document.querySelectorAll('.mentor-card').forEach((card) => {
	card.tabIndex = 0;
	card.setAttribute('role', 'button');
	card.setAttribute('aria-haspopup', 'dialog');
	const openBiography = () => {
		mentorDialog.querySelector('.mentor-role').textContent = card.querySelector('.mentor-role').textContent;
		mentorDialog.querySelector('h2').textContent = card.querySelector('h3').textContent;
		mentorDialog.querySelector('.mentor-dialog-bio').textContent = card.querySelector('.mentor-details>p:last-child').textContent;
		mentorDialog.showModal();
	};
	card.addEventListener('click', openBiography);
	card.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openBiography();
		}
	});
});
