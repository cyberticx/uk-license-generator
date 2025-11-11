// ---------------------------
// UK Licence Generator + Validator
// ---------------------------

// Function to generate a realistic (but fictional) UK driving license number
// Structure used here (simplified but consistent):
// [5 letters surname] [YY][MM or MM+50 if female][DD] [First initial] [4 alnum]  => total 16 chars
function generateUKLicenseNumber(firstName, lastName, gender, dobString) {
    let license = '';

    // Part 1: First 5 letters from surname (padded with 9s if too short)
    let surnamePart = (lastName || '').toUpperCase().replace(/[^A-Z]/g, '');
    surnamePart = (surnamePart + '99999').substring(0, 5);
    license += surnamePart;

    // Part 2: Date of Birth part (YYMMDD format)
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) {
        // invalid date - fallback to a random DOB to avoid breaking
        const fallback = randomAdultDOB();
        dob.setTime(fallback.getTime());
    }
    const year = String(dob.getFullYear()).slice(-2);
    let month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    if ((gender || '').toUpperCase() === 'F') {
        month = String(parseInt(month, 10) + 50).padStart(2, '0'); // Female month + 50
    }

    license += year + month + day;

    // Part 3: First name initial (or 9 if missing)
    const firstInitial = (firstName || '').toUpperCase().charAt(0) || '9';
    license += firstInitial;

    // Part 4: Remaining characters to reach 16 length
    const remainingLength = 16 - license.length;
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < remainingLength; i++) {
        license += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }

    return license;
}

// ---------- Improved randomization ----------
function randomAdultDOB() {
    const today = new Date();
    const minYear = today.getFullYear() - 65;
    const maxYear = today.getFullYear() - 18;
    const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const month = Math.floor(Math.random() * 12); // 0-11
    const day = Math.floor(Math.random() * 28) + 1; // 1-28 (safe)
    return new Date(year, month, day);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomizeInputs() {
    // Larger UK-ish name lists to reduce repetition
    const firstNames = [
        'Oliver','George','Harry','Jack','Jacob','Noah','Charlie','Muhammad','Thomas','Oscar',
        'William','James','Leo','Alfie','Henry','Freya','Olivia','Amelia','Isla','Ava',
        'Emily','Mia','Lily','Sophia','Grace','Chloe','Ella','Sienna','Poppy','Isabelle'
    ];
    const lastNames = [
        'Smith','Jones','Williams','Taylor','Brown','Davies','Evans','Wilson','Thomas','Roberts',
        'Johnson','Lewis','Walker','Robinson','Wright','Thompson','White','Edwards','Hughes','Green',
        'Hall','Wood','Jackson','Clarke','Turner','Martin','Cooper','Hill','Ward','Morris'
    ];
    const genders = ['M', 'F'];

    let first = pickRandom(firstNames);
    let last = pickRandom(lastNames);
    // Ensure not the same string repeated accidentally (very unlikely but safe)
    while (!last || last.toLowerCase() === first.toLowerCase()) {
        last = pickRandom(lastNames);
    }

    document.getElementById('firstName').value = first;
    document.getElementById('lastName').value = last;
    document.getElementById('gender').value = pickRandom(genders);

    const dob = randomAdultDOB();
    const dobYear = dob.getFullYear();
    const dobMonth = String(dob.getMonth() + 1).padStart(2, '0');
    const dobDay = String(dob.getDate()).padStart(2, '0');
    document.getElementById('dob').value = `${dobYear}-${dobMonth}-${dobDay}`;
}

// ---------- Event handlers (unchanged behaviour) ----------
document.getElementById('generateBtn').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const dob = document.getElementById('dob').value; // YYYY-MM-DD format

    if (!firstName || !lastName || !gender || !dob) {
        alert('Please fill in all fields (First Name, Last Name, Gender, Date of Birth).');
        return;
    }

    const generatedLicense = generateUKLicenseNumber(firstName, lastName, gender, dob);
    const outputEl = document.getElementById('licenseNumberOutput');
    outputEl.value = generatedLicense;

    // Validate and give quick feedback (console + tooltip)
    const isValid = validateUKLicense(generatedLicense);
    console.log('Generated License:', generatedLicense, 'Valid?', isValid);
    outputEl.title = isValid ? 'Looks like a valid fictional UK-style licence number (passes validator).' :
                              'Does NOT pass the validator — format or date parts look off.';
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
    randomizeInputs();
    // keep it manual to generate (you previously said you want to type names)
    // If you want auto-generate immediately after randomize, uncomment next line:
    // document.getElementById('generateBtn').click();
});

// Optional: Generate a random set of inputs on page load
window.addEventListener('load', randomizeInputs);

// ------------------- Additional generator used by "Generate 50 Licenses" page -------------------
function generateFictionalUKLicenseNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let license = '';
    // Part 1: 5 letters
    for (let i = 0; i < 5; i++) {
        license += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Part 2: YYMMDD (random adult DOB)
    const dob = randomAdultDOB();
    const year = String(dob.getFullYear()).slice(-2);
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    // 50% chance to encode as female (month + 50)
    const maybeFemale = Math.random() < 0.5;
    const encodedMonth = maybeFemale ? String(parseInt(month, 10) + 50).padStart(2, '0') : month;

    license += year + encodedMonth + day;

    // Part 3: random gender/initial char
    license += Math.random() < 0.5 ? 'M' : 'F';

    // Part 4: fill to 16 chars
    const allChars = chars + numbers;
    const remainingLength = 16 - license.length;
    for (let i = 0; i < remainingLength; i++) {
        license += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return license;
}

function generateAndDisplayLicenses(count) {
    const container = document.getElementById('licenseListContainer');
    if (!container) return;
    container.innerHTML = ''; // Clear previous content

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';

    for (let i = 0; i < count; i++) {
        const licenseNumber = generateFictionalUKLicenseNumber();
        const li = document.createElement('li');
        li.textContent = licenseNumber;
        li.style.marginBottom = '5px';
        ul.appendChild(li);
    }
    container.appendChild(ul);
}

function copyAllLicenses() {
    const container = document.getElementById('licenseListContainer');
    if (!container) {
        alert('No license list container found.');
        return;
    }
    const allLicensesText = container.textContent.trim().split('\n').filter(Boolean).join('\n');

    if (allLicensesText) {
        navigator.clipboard.writeText(allLicensesText).then(() => {
            alert('All licenses copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy licenses. Please try again or copy manually.');
        });
    } else {
        alert('No licenses to copy yet. Generate them first!');
    }
}

// ------------------- Validator / Helpful Regex -------------------

// Helpful regex (simple): checks 16 chars, starts with 5 letters, then 6 digits, then 1 letter, then 4 alnum
// const simpleRegex = /^[A-Z]{5}\d{6}[A-Z][A-Z0-9]{4}$/;

// Robust validator function that:
// - Ensures length 16
// - First 5 chars are A-Z
// - Next 6 are digits (YYMMDD) where MM is 01-12 or 51-62 (female +50)
// - Day is 01-31 (basic check)
// - Next char is A-Z (first initial) or digit '9' fallback
// - Remaining 4 are alphanumeric
function validateUKLicense(lic) {
    if (typeof lic !== 'string') return false;
    lic = lic.trim().toUpperCase();
    if (lic.length !== 16) return false;

    // First 5 must be letters A-Z
    const surname = lic.substring(0, 5);
    if (!/^[A-Z]{5}$/.test(surname)) return false;

    // Next 6 must be digits YYMMDD
    const yy = lic.substring(5, 7);
    const mm = lic.substring(7, 9);
    const dd = lic.substring(9, 11);
    if (!/^\d{2}$/.test(yy + mm + dd)) return false;

    const mmNum = parseInt(mm, 10);
    const ddNum = parseInt(dd, 10);

    // Month valid: either 1-12 or 51-62 (female encoded month +50)
    if (!((mmNum >= 1 && mmNum <= 12) || (mmNum >= 51 && mmNum <= 62))) {
        return false;
    }

    // Day valid basic check (1-31)
    if (!(ddNum >= 1 && ddNum <= 31)) {
        return false;
    }

    // Next char initial
    const initial = lic.charAt(11);
    if (!/^[A-Z0-9]$/.test(initial)) { // allow A-Z or fallback 9
        return false;
    }

    // Remaining 4 chars alphanumeric
    const tail = lic.substring(12);
    if (!/^[A-Z0-9]{4}$/.test(tail)) return false;

    // Optional: additional sanity check on YY (not necessary but could be done)
    // If all passed, likely matches typical simplified format
    return true;
}

// Small helper to test a value with the validator and print advice
function testAndLog(lic) {
    const ok = validateUKLicense(lic);
    console.log(`Test "${lic}" => ${ok ? 'VALID (passes validator)' : 'INVALID (fails validator)'}`);
    return ok;
}

// Example: test the sample you gave
// ADEYE715418YM06X  <-- you asked about similar format earlier
// Let's run a console test (won't break UI; just logs)
console.log('Validator examples:');
testAndLog('ADEYE715418YM06X'); // your example
testAndLog('SMITH870312J9AB4'); // another example

// Export functions to global in case you want to call from console or HTML inline buttons
window.generateUKLicenseNumber = generateUKLicenseNumber;
window.validateUKLicense = validateUKLicense;
window.generateAndDisplayLicenses = generateAndDisplayLicenses;
window.copyAllLicenses = copyAllLicenses;
