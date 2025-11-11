// Function to generate a realistic (but fictional) UK driving license number
// Based on typical UK format: 5 letters (surname) + DOB (YYMMDD) + Initial + Random chars
function generateUKLicenseNumber(firstName, lastName, gender, dobString) {
    let license = '';

    // Part 1: First 5 letters from surname (padded with 9s if too short)
    let surnamePart = lastName.toUpperCase().replace(/[^A-Z]/g, '');
    surnamePart = (surnamePart + '99999').substring(0, 5);
    license += surnamePart;

    // DOB part: YYMMDD (Female month +50)
    const dob = new Date(dobString);
    const year = String(dob.getFullYear()).slice(-2);
    let month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    if (gender.toUpperCase() === 'F') {
        month = String(parseInt(month) + 50).padStart(2, '0');
    }

    license += year + month + day;

    // Initial
    const firstInitial = firstName.toUpperCase().charAt(0) || '9';
    license += firstInitial;

    // Finish to 16 chars
    const remainingLength = 16 - license.length;
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < remainingLength; i++) {
        license += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }

    return license;
}


// Randomizer for input values
function randomizeInputs() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson'];
    const genders = ['M', 'F'];

    document.getElementById('firstName').value =
        firstNames[Math.floor(Math.random() * firstNames.length)];

    document.getElementById('lastName').value =
        lastNames[Math.floor(Math.random() * lastNames.length)];

    document.getElementById('gender').value =
        genders[Math.floor(Math.random() * genders.length)];

    // Random DOB
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    const randomTimestamp =
        minAgeDate.getTime() + Math.random() * (maxAgeDate.getTime() - minAgeDate.getTime());

    const randomDate = new Date(randomTimestamp);

    const dobYear = randomDate.getFullYear();
    const dobMonth = String(randomDate.getMonth() + 1).padStart(2, '0');
    const dobDay = String(randomDate.getDate()).padStart(2, '0');

    document.getElementById('dob').value = `${dobYear}-${dobMonth}-${dobDay}`;
}


// Event listeners
document.getElementById('generateBtn').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;

    if (!firstName || !lastName || !gender || !dob) {
        alert('Please fill in all fields (First Name, Last Name, Gender, Date of Birth).');
        return;
    }

    const generatedLicense = generateUKLicenseNumber(firstName, lastName, gender, dob);
    document.getElementById('licenseNumberOutput').value = generatedLicense;
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
    randomizeInputs();
});

window.addEventListener('load', randomizeInputs);


// --------------- BULK LICENSE GENERATOR SECTION ---------------- //

// Generate one fictional UK-style license number
function generateFictionalUKLicenseNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let license = '';

    // 5 letters
    for (let i = 0; i < 5; i++) {
        license += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // DOB YYMMDD
    const year = String(Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950).slice(-2);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    license += year + month + day;

    // Gender/Initial
    license += Math.random() < 0.5 ? 'M' : 'F';

    // Fill remaining
    const allChars = chars + numbers;
    const remainingLength = 16 - license.length;

    for (let i = 0; i < remainingLength; i++) {
        license += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return license;
}


// Generate list of fictional licenses
function generateAndDisplayLicenses(count) {
    const container = document.getElementById('licenseListContainer');
    container.innerHTML = '';

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


// Copy to clipboard
function copyAllLicenses() {
    const container = document.getElementById('licenseListContainer');
    const allLicensesText = container.textContent.trim().split('\n').filter(Boolean).join('\n');

    if (allLicensesText) {
        navigator.clipboard.writeText(allLicensesText)
            .then(() => alert('All licenses copied to clipboard!'))
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy licenses. Please try again.');
            });
    } else {
        alert('No licenses to copy yet.');
    }
}
