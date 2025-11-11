/* script.js
   Restored combined behavior:
   - custom single generator (fill fields, generate)
   - randomize input helper
   - bulk fictional generator (generate N)
   - helpful regex and validator for DLP testing
*/

/* -------------------------
   Helpful regex (approx)
   -------------------------
   Typical simplified pattern used here:
     5 letters (surname) + 6 digits (YYMMDD) + 1 letter initial + 4 alnum = 16 chars total
   Regex (JS):
     /^[A-Z]{5}\d{6}[A-Z][A-Z0-9]{4}$/
   This is a useful pattern for DLP tests but note: real UK driving-licence encoding is more complex.
*/

const DLP_REGEX = /^[A-Z]{5}\d{6}[A-Z][A-Z0-9]{4}$/;

/* Validator function */
function validateUKLicense(lic) {
  if (typeof lic !== 'string') return false;
  const normalized = lic.trim().toUpperCase();
  return DLP_REGEX.test(normalized);
}

/* ---- Single custom generator ---- */
function generateUKLicenseNumber(firstName, lastName, gender, dobString) {
  let license = '';

  // Part 1: 5 letters from surname, pad with 9 if short
  let surnamePart = (lastName || '').toUpperCase().replace(/[^A-Z]/g, '');
  surnamePart = (surnamePart + '99999').substring(0, 5);
  license += surnamePart;

  // Part 2: DOB YYMMDD (female month +50)
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    // fallback to random date if invalid
    const y = Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950;
    const m = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 28) + 1;
    dob.setFullYear(y, m - 1, d);
  }
  const year = String(dob.getFullYear()).slice(-2);
  let month = String(dob.getMonth() + 1).padStart(2, '0');
  const day = String(dob.getDate()).padStart(2, '0');

  if ((gender || '').toUpperCase() === 'F') {
    month = String(parseInt(month, 10) + 50).padStart(2, '0');
  }
  license += year + month + day;

  // Part 3: first initial (or 9)
  const firstInitial = (firstName || '9').toUpperCase().charAt(0) || '9';
  license += firstInitial;

  // Part 4: pad to 16 characters with random alnum
  const remainingLength = 16 - license.length;
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < remainingLength; i++) {
    license += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return license;
}

/* ---- Randomize inputs helper ---- */
function randomizeInputs() {
  const firstNames = ['Oliver','Harry','George','Noah','Jack','Jacob','Olivia','Amelia','Isla','Emily','Ava','Mia','Thomas','Charlie','Grace','Sophie','Michael','Jane','David','Emma'];
  const lastNames = ['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Robinson','Wright','Thompson','Evans','Walker','White','Harris','Martin','Hall','Clark','Turner','Hill'];
  const genders = ['M','F'];

  document.getElementById('firstName').value = firstNames[Math.floor(Math.random()*firstNames.length)];
  document.getElementById('lastName').value = lastNames[Math.floor(Math.random()*lastNames.length)];
  document.getElementById('gender').value = genders[Math.floor(Math.random()*genders.length)];

  // random DOB 18-70 years old
  const today = new Date();
  const min = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate()).getTime();
  const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).getTime();
  const ts = Math.floor(min + Math.random() * (max - min));
  const rd = new Date(ts);
  const y = rd.getFullYear();
  const m = String(rd.getMonth() + 1).padStart(2, '0');
  const d = String(rd.getDate()).padStart(2, '0');
  document.getElementById('dob').value = `${y}-${m}-${d}`;
}

/* ---- Bulk fictional generator (keeps your previous behavior) ---- */
function generateFictionalUKLicenseNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums  = '0123456789';
  let license = '';
  // 5 letters
  for (let i=0;i<5;i++){
    license += chars.charAt(Math.floor(Math.random()*chars.length));
  }
  // YYMMDD random (year 1950-2005)
  const year = String(Math.floor(Math.random()*(2005-1950+1))+1950).slice(-2);
  const month = String(Math.floor(Math.random()*12)+1).padStart(2,'0');
  const day = String(Math.floor(Math.random()*28)+1).padStart(2,'0');
  license += year + month + day;
  // gender initial M/F
  license += Math.random() < 0.5 ? 'M' : 'F';
  // remaining to 16 chars
  const all = chars + nums;
  const rem = 16 - license.length;
  for (let i=0;i<rem;i++){
    license += all.charAt(Math.floor(Math.random()*all.length));
  }
  return license;
}

/* ---- DOM wiring ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const generateBtn = document.getElementById('generateBtn');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const copySingleBtn = document.getElementById('copySingleBtn');
  const generateBulkBtn = document.getElementById('generateBulkBtn');
  const copyAllBtn = document.getElementById('copyAllBtn');
  const validateBtn = document.getElementById('validateBtn');

  const firstNameEl = document.getElementById('firstName');
  const lastNameEl  = document.getElementById('lastName');
  const genderEl    = document.getElementById('gender');
  const dobEl       = document.getElementById('dob');
  const outputEl    = document.getElementById('licenseNumberOutput');
  const licenseList = document.getElementById('licenseListContainer');

  // auto-randomize on load (original behaviour)
  randomizeInputs();

  generateBtn.addEventListener('click', () => {
    const fn = (firstNameEl.value || '').trim();
    const ln = (lastNameEl.value || '').trim();
    const g  = (genderEl.value || '').trim();
    const d  = (dobEl.value || '').trim();

    if (!fn || !ln || !g || !d) {
      alert('Please fill in all fields (First Name, Last Name, Gender, Date of Birth).');
      return;
    }
    const lic = generateUKLicenseNumber(fn, ln, g, d);
    outputEl.value = lic;
    document.getElementById('validateResult').textContent = ''; // clear validation label
  });

  randomizeBtn.addEventListener('click', () => {
    randomizeInputs();
    // if you want auto-generate after randomize, uncomment next two lines:
    // document.getElementById('generateBtn').click();
  });

  copySingleBtn.addEventListener('click', async () => {
    const text = outputEl.value.trim();
    if (!text) { alert('No generated license to copy — generate one first.'); return; }
    try {
      await navigator.clipboard.writeText(text);
      alert('License copied to clipboard.');
    } catch (e) {
      alert('Copy failed — select and copy manually.');
    }
  });

  // Validate button uses the helpful regex
  validateBtn.addEventListener('click', () => {
    const lic = outputEl.value.trim();
    if (!lic) { alert('No license in output to validate.'); return; }
    const ok = validateUKLicense(lic);
    const node = document.getElementById('validateResult');
    if (ok) {
      node.textContent = 'Valid (matches pattern)';
      node.style.color = 'green';
    } else {
      node.textContent = 'Invalid (does not match pattern)';
      node.style.color = 'crimson';
    }
  });

  // Bulk generate
  generateBulkBtn.addEventListener('click', () => {
    const count = Math.min(500, Math.max(1, parseInt(document.getElementById('bulkCount').value || '50', 10)));
    licenseList.innerHTML = ''; // clear
    const ul = document.createElement('ul');
    for (let i=0;i<count;i++){
      const li = document.createElement('li');
      li.textContent = generateFictionalUKLicenseNumber();
      ul.appendChild(li);
    }
    licenseList.appendChild(ul);
  });

  // Copy all
  copyAllBtn.addEventListener('click', async () => {
    const text = licenseList.textContent.trim().split('\n').map(s=>s.trim()).filter(Boolean).join('\n');
    if (!text) { alert('No licenses to copy — generate first.'); return; }
    try {
      await navigator.clipboard.writeText(text);
      alert('All licenses copied to clipboard.');
    } catch (e) {
      alert('Copy failed — try selecting and copying manually.');
    }
  });

}); // DOMContentLoaded
