const departments = [
  ['🏛️', 'Ministry of Tiny Decisions', 'Checking whether this truly needed a government form.'],
  ['🧑‍⚖️', 'Department of Official Vibes', 'Measuring the seriousness of your unserious request.'],
  ['🕵️', 'Bureau of Specific Requests', 'Searching for any detail we can make more complicated.'],
  ['🗂️', 'Central Paper-Shuffling Authority', 'Moving your file from the left pile to the right pile.'],
  ['🧓', 'Office of the Honourable Chairperson', 'Nodding thoughtfully after reading only the subject line.'],
  ['🪄', 'Directorate of Mildly Magical Affairs', 'Consulting a very official-looking crystal ball.'],
  ['📠', 'Fax & Fax-Related Innovations Cell', 'Sending a confirmation fax directly into the void.']
];
const circulars = [
  'Official clarification: “Just because” is a constitutionally valid reason here.',
  'Urgent circular: The queue for nothing is moving surprisingly slowly.',
  'Breaking: The Ministry processed a thought. Nobody knows whose.',
  'Compliance reminder: Smiling at the certificate is optional but strongly encouraged.',
  'Public notice: Do not use this permit to win an argument with your sibling.'
];
const conditions = [
  'One biscuit must be consumed in honour of the five committees involved.',
  'Do not make eye contact with this certificate after midnight.',
  'If challenged, blame the Department of Vibes with full confidence.',
  'This permission expires immediately after it becomes useful.',
  'One dramatic sigh is legally recommended before proceeding.'
];
const signatures = [
  ['Pending Kumar (finally)', 'Chief Officer, Naps & National Affairs'],
  ['Dr. B. K. Yaar, reluctantly', 'Director of Bas Ek Minute Operations'],
  ['Hon. Lefty, on a tea break', 'Deputy Secretary for Avoidable Decisions'],
  ['S. Stamp, Esq. (probably)', 'Acting Head of the Snack-Related Committee']
];
const featured = [
  ['Riya K.', 'Ignoring a group-chat notification for 36 hours', 'PUT-FEAT-001', 'The silence was approved as self-care.'],
  ['Arjun D.', 'Calling a nap a strategic energy summit', 'PUT-FEAT-042', 'Approved with one pillow-related condition.'],
  ['Sana M.', 'Buying another black hoodie despite owning six', 'PUT-FEAT-078', 'The Cabinet called it a national wardrobe emergency.'],
  ['Kabir P.', 'Staring at the fridge and finding absolutely nothing', 'PUT-FEAT-108', 'A historic act of kitchen-based research.']
];
const pick = list => list[Math.floor(Math.random() * list.length)];
const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[character]));
let currentPermit = null;

function setTabs() {
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(`${button.dataset.tab}-page`).classList.add('active');
  }));
}
function renderHall() {
  const stored = JSON.parse(localStorage.getItem('uselessAskHistory') || '[]');
  const allCases = [...stored.map(item => [item.name, item.purpose, item.number, item.comment]), ...featured];
  document.getElementById('archive-list').innerHTML = allCases.map(([name,purpose,number,note]) => `
    <article class="archive-row"><span class="emoji">${number.startsWith('UA') ? '📜' : '🏛️'}</span><div><b>${escapeHTML(name)} requested permission for: ${escapeHTML(purpose)}</b><small>${escapeHTML(number)} · ${escapeHTML(note)}</small></div><span class="approved">APPROVED</span></article>`).join('');
}
function replyForMission(mission) {
  return pick([
    `After reading “${mission}”, the committee took a deep breath and approved it before anyone could ask why.`,
    `Your mission “${mission}” has been classified as emotionally important and logically unnecessary. Perfect.`,
    `The Cabinet reviewed “${mission}” and agreed it deserves three forms and one dramatic stamp.`,
    `Regarding “${mission}”: the Ministry supports your bravery, confidence, and none of your planning.`
  ]);
}
function replyForWitness(witness) {
  return witness ? pick([
    `${witness} has been listed as a witness and is now 12% more official than before.`,
    `We contacted ${witness} spiritually. Their confused silence has been accepted as testimony.`,
    `${witness} may never know about this, but the Ministry thanks them for their invisible service.`
  ]) : 'No witness was submitted. The Cabinet appointed an emotionally neutral bystander and promised not to bother them.';
}
function createPermit(form) {
  const name = form.name.value.trim();
  const selected = form.category.value;
  const custom = form.mission.value.trim();
  const purpose = selected === 'custom' && custom ? custom : selected;
  const witness = form.witness.value.trim() || 'An emotionally neutral bystander';
  const sign = pick(signatures);
  const number = `UA-${String(Date.now()).slice(-6)}-${Math.random().toString(16).slice(2,6).toUpperCase()}`;
  const shuffled = [...departments].sort(() => Math.random() - .5).slice(0,5);
  return { name, purpose, mission: custom || purpose, witness, urgency: form.urgency.value, number, departments: shuffled, condition: pick(conditions), missionReply: replyForMission(custom || purpose), witnessReply: replyForWitness(form.witness.value.trim()), signature: sign[0], role: sign[1], comment: 'The committee found the request gloriously unnecessary.', date: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) };
}
function animateApproval(permit) {
  const section = document.getElementById('approval-section');
  const list = document.getElementById('approval-list');
  const progress = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  section.classList.remove('hidden'); document.getElementById('certificate-section').classList.add('hidden');
  list.innerHTML = permit.departments.map(([emoji,name,action], index) => `<article class="approval-row"><span class="emoji">${emoji}</span><div><b>${name}</b><small>${action}</small></div><span class="status" id="status-${index}">IN REVIEW</span></article>`).join('');
  document.getElementById('reaction-grid').innerHTML = `<article class="reaction"><span class="section-label">🧠 WHY DID THE CABINET SAY YES?</span><p>${escapeHTML(permit.missionReply)}</p></article><article class="reaction"><span class="section-label">🕵️ WITNESS DESK PANIC REPORT</span><p>${escapeHTML(permit.witnessReply)}</p></article>`;
  section.scrollIntoView({ behavior:'smooth', block:'start' });
  let index = 0;
  const timer = setInterval(() => {
    if (index < permit.departments.length) {
      document.getElementById(`status-${index}`).textContent = 'CLEARED';
      document.getElementById(`status-${index}`).classList.add('cleared');
      progress.style.width = `${(index + 1) * 20}%`;
      label.textContent = `File being admired by ${permit.departments[index][1]}...`;
      index += 1;
    } else {
      clearInterval(timer); label.textContent = 'All procedures completed with magnificent inefficiency.';
      setTimeout(() => { renderCertificate(permit); document.getElementById('certificate-section').classList.remove('hidden'); }, 450);
    }
  }, 620);
}
function renderCertificate(permit) {
  document.getElementById('certificate').innerHTML = `
    <header class="cert-header"><div><div class="cert-brand">📜 USELESS ASK</div><div class="cert-sub">MINISTRY OF ABSOLUTELY NECESSARY NONSENSE</div></div><div class="cert-file">FILE: ${escapeHTML(permit.number)}<br />FIVE NODS. ZERO READING.</div></header>
    <div class="cert-law">ISSUED UNDER SECTION 404: COMMON SENSE NOT FOUND</div><h3>CERTIFICATE OF QUESTIONABLE NECESSITY</h3>
    <div class="cert-approved">APPROVED (SOMEHOW)</div><p class="intro">This excessively laminated-looking document confirms that</p><div class="cert-name">${escapeHTML(permit.name)}</div><p class="allowed">is hereby allowed to attempt:</p><div class="cert-purpose">${escapeHTML(permit.purpose)}</div>
    <section class="cert-facts"><div><b>FILE STATUS</b>Looked at briefly · ${escapeHTML(permit.number)}</div><div><b>URGENCY</b>Emotionally dramatic · ${escapeHTML(permit.urgency)}</div><div><b>WITNESS STATUS</b>Unfortunately involved · ${escapeHTML(permit.witness)}</div></section>
    <section class="cert-notes"><div class="cert-note"><b>WHY DID THE CABINET SAY YES?</b>${escapeHTML(permit.missionReply)}</div><div class="cert-note"><b>WITNESS DESK PANIC REPORT</b>${escapeHTML(permit.witnessReply)}</div></section>
    <section class="cert-bottom"><div class="cert-condition"><b>ONE CONDITION (WE NEEDED TO FEEL IMPORTANT)</b>${escapeHTML(permit.condition)}<div class="cert-warning">Warning: not accepted by parents, professors, banks, or anyone with common sense.</div></div><div class="cert-stamp">STAMPED AT<br />2% BATTERY</div></section>
    <div class="cert-signature">${escapeHTML(permit.signature)}<br /><small>${escapeHTML(permit.role)}</small><br /><small>Signed during a meeting that could have been a nap.</small></div><footer class="cert-footer">Issued on ${escapeHTML(permit.date)} · Valid until a responsible adult asks one reasonable question.</footer>`;
}
function savePermit(permit) {
  const history = JSON.parse(localStorage.getItem('uselessAskHistory') || '[]'); history.unshift(permit); localStorage.setItem('uselessAskHistory', JSON.stringify(history.slice(0,5)));
  document.getElementById('permit-count').textContent = (1284 + history.length).toLocaleString('en-IN'); renderHall();
}
function downloadCertificate() {
  const style = document.querySelector('link[href="style.css"]').href;
  const html = `<!doctype html><html><head><meta charset="UTF-8"><title>Useless Ask Certificate</title><link rel="stylesheet" href="${style}"><style>body{padding:30px;background:#171026}.certificate{max-width:1100px;margin:auto}</style></head><body>${document.getElementById('certificate').outerHTML}</body></html>`;
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([html], {type:'text/html'})); link.download = `useless-ask-${currentPermit.number.toLowerCase()}.html`; link.click(); URL.revokeObjectURL(link.href);
}
document.getElementById('application-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget; const error = document.getElementById('form-error');
  if (!form.name.value.trim()) { error.textContent = 'Every great useless request needs an applicant name.'; return; }
  if (form.category.value === 'custom' && !form.mission.value.trim()) { error.textContent = 'Please describe the custom pointless mission first.'; return; }
  if (!document.getElementById('useless-check').checked) { error.textContent = 'Please certify the uselessness. The cabinet is strict about this part.'; return; }
  error.textContent = ''; currentPermit = createPermit(form); savePermit(currentPermit); animateApproval(currentPermit);
});
document.getElementById('new-circular').addEventListener('click', () => document.getElementById('circular-text').textContent = pick(circulars));
document.getElementById('vote-button').addEventListener('click', () => { const selected = document.querySelector('input[name="poll"]:checked').value; document.getElementById('poll-result').innerHTML = `<strong>Cabinet verdict:</strong> “${escapeHTML(selected)}” received one vote and three dramatic press conferences.`; });
document.getElementById('download-certificate').addEventListener('click', downloadCertificate);
document.getElementById('print-certificate').addEventListener('click', () => window.print());
setTabs(); renderHall();
