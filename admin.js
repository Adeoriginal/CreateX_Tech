const storageKey = 'createXRegistrations';
const recordsBody = document.querySelector('#records-body');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const courseFilter = document.querySelector('#course-filter');
const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const adminPassword = 'CreateXAdmin2026!';

function getRegistrations() {
	return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function formatDate(value) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function render() {
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
			localStorage.setItem(storageKey, JSON.stringify(getRegistrations().filter((item) => item.id !== registration.id)));
			render();
		});
		recordsBody.append(row);
	});

	emptyState.hidden = filtered.length > 0;
	document.querySelector('#total-count').textContent = registrations.length;
	document.querySelector('#latest-date').textContent = registrations.length ? formatDate(new Date(Math.max(...registrations.map((item) => item.id)))) : '—';
	const courseCounts = registrations.reduce((counts, item) => ({ ...counts, [item.course]: (counts[item.course] || 0) + 1 }), {});
	document.querySelector('#popular-course').textContent = Object.keys(courseCounts).sort((a, b) => courseCounts[b] - courseCounts[a])[0] || '—';
}

function exportCsv() {
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

function showDashboard() {
	loginPanel.hidden = true;
	dashboard.hidden = false;
	searchInput.addEventListener('input', render);
	courseFilter.addEventListener('change', render);
	document.querySelector('#export-button').addEventListener('click', exportCsv);
	document.querySelector('#clear-button').addEventListener('click', () => {
		if (getRegistrations().length && window.confirm('Delete all student registrations from this browser?')) {
			localStorage.removeItem(storageKey);
			render();
		}
	});
	render();
}

loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (loginForm.elements['admin-password'].value !== adminPassword) {
		loginError.hidden = false;
		return;
	}
	sessionStorage.setItem('createXAdminAuthenticated', 'true');
	showDashboard();
});

if (sessionStorage.getItem('createXAdminAuthenticated') === 'true') showDashboard();