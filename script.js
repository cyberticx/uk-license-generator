// ============================================
// CORE LICENSE GENERATION FUNCTION
// ============================================
// Function to generate a realistic (but fictional) UK driving license number
// Based on typical UK format: 5 letters (surname) + DOB (YYMMDD) + Initials + Check Digits
function generateUKLicenseNumber(firstName, lastName, gender, dobString) {
    let license = '';

    // Part 1: First 5 letters from surname (padded with 9s if too short)
    let surnamePart = lastName.toUpperCase().replace(/[^A-Z]/g, ''); // Remove non-alpha
    surnamePart = (surnamePart + '99999').substring(0, 5); // Ensure 5 chars, pad with 9s if needed
    license += surnamePart;

    // Part 2: Date of Birth part (YYMMDD format, e.g., 870312 for 12 March 1987)
    // If female, month is +50
    const dob = new Date(dobString);
    const year = String(dob.getFullYear()).slice(-2);
    let month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    if (gender.toUpperCase() === 'F') {
        month = String(parseInt(month) + 50).padStart(2, '0'); // Female month + 50
    }

    license += year + month + day;

    // Part 3: First name initial
    const firstInitial = firstName.toUpperCase().charAt(0) || '9';
    license += firstInitial;

    // Part 4: Random alphanumeric characters to make it 16 total
    const remainingLength = 16 - license.length;
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < remainingLength; i++) {
        license += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }

    return license;
}

// ============================================
// RANDOM DATA GENERATION
// ============================================
// Function to populate random data into the input fields
function randomizeInputs() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Mary', 'Robert', 'Patricia'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Davis', 'Miller', 'Moore', 'Anderson'];
    const genders = ['M', 'F'];

    document.getElementById('firstName').value = firstNames[Math.floor(Math.random() * firstNames.length)];
    document.getElementById('lastName').value = lastNames[Math.floor(Math.random() * lastNames.length)];
    document.getElementById('gender').value = genders[Math.floor(Math.random() * genders.length)];

    // Random DOB within a reasonable range (18-65 years ago from current date)
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    const randomTimestamp = minAgeDate.getTime() + Math.random() * (maxAgeDate.getTime() - minAgeDate.getTime());
    const randomDate = new Date(randomTimestamp);
    const dobYear = randomDate.getFullYear();
    const dobMonth = String(randomDate.getMonth() + 1).padStart(2, '0');
    const dobDay = String(randomDate.getDate()).padStart(2, '0');
    document.getElementById('dob').value = `${dobYear}-${dobMonth}-${dobDay}`;
}

// Helper function to generate random person data
function generateRandomPerson() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Mary', 'Robert', 'Patricia'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Davis', 'Miller', 'Moore', 'Anderson'];
    const genders = ['M', 'F'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];

    // Random DOB between 1950 and 2005
    const year = Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;

    return { firstName, lastName, gender, dob };
}

// ============================================
// FORM-BASED GENERATOR EVENT LISTENERS
// ============================================
document.getElementById('generateBtn').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value; // YYYY-MM-DD format

    if (!firstName || !lastName || !gender || !dob) {
        alert('Please fill in all fields (First Name, Last Name, Gender, Date of Birth).');
        return;
    }

    const generatedLicense = generateUKLicenseNumber(firstName, lastName, gender, dob);
    document.getElementById('licenseNumberOutput').value = generatedLicense;
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
    randomizeInputs();
    // Automatically generate after randomizing
    setTimeout(() => {
        document.getElementById('generateBtn').click();
    }, 100);
});

// ============================================
// BULK LICENSE GENERATION
// ============================================
// Function to generate and display N licenses
function generateAndDisplayLicenses(count) {
    const container = document.getElementById('licenseListContainer');
    container.innerHTML = ''; // Clear previous content

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';
    ul.style.fontFamily = 'monospace';
    ul.style.fontSize = '14px';

    const licenses = [];

    for (let i = 0; i < count; i++) {
        const person = generateRandomPerson();
        const licenseNumber = generateUKLicenseNumber(
            person.firstName,
            person.lastName,
            person.gender,
            person.dob
        );
        
        licenses.push(licenseNumber);

        const li = document.createElement('li');
        li.textContent = licenseNumber;
        li.style.marginBottom = '5px';
        li.style.padding = '5px';
        li.style.backgroundColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
        ul.appendChild(li);
    }
    
    container.appendChild(ul);
    
    // Store licenses globally for copying
    window.generatedLicenses = licenses;
}

// Function to copy all generated licenses to the clipboard
function copyAllLicenses() {
    if (!window.generatedLicenses || window.generatedLicenses.length === 0) {
        alert('No licenses to copy yet. Generate them first!');
        return;
    }

    const allLicensesText = window.generatedLicenses.join('\n');

    navigator.clipboard.writeText(allLicensesText).then(() => {
        alert(`All ${window.generatedLicenses.length} licenses copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy licenses. Please try again or copy manually.');
    });
}

// ============================================
// INITIALIZATION
// ============================================
// Optional: Generate random data on page load for the form
window.addEventListener('load', () => {
    randomizeInputs();
});
