// Function to generate a realistic (but fictional) UK driving license number
// Based on typical UK format: 5 letters (surname) + DOB (YYMMDD/DDMMYY, depends on format) + Initials + Check Digits
// Let's go for a common structure like: [5 chars surname] [YY] [MM] [DD] [Gender initial] [Random chars]
function generateUKLicenseNumber(firstName, lastName, gender, dobString) {
    let license = '';

    // Part 1: First 5 letters from surname (padded with 9s if too short, or take first 5)
    let surnamePart = lastName.toUpperCase().replace(/[^A-Z]/g, ''); // Remove non-alpha
    surnamePart = (surnamePart + '99999').substring(0, 5); // Ensure 5 chars, pad with 9s if needed
    license += surnamePart;

    // Part 2: Date of Birth part (YYMMDD format, e.g., 870312 for 12 March 1987)
    // Note: UK licenses have a complex DOB encoding; this is a simplification.
    // If female, month can be +50.
    const dob = new Date(dobString);
    const year = String(dob.getFullYear()).slice(-2);
    let month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    if (gender.toUpperCase() === 'F') {
        month = String(parseInt(month) + 50).padStart(2, '0'); // Female month + 50
    }

    license += year + month + day;

    // Part 3: First name initial and middle name initial (or random if not enough)
    const firstInitial = firstName.toUpperCase().charAt(0) || '9';
    license += firstInitial;

    // Part 4: A few more random characters to make it 16 total
    const remainingLength = 16 - license.length;
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < remainingLength; i++) {
        license += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }

    return license;
}

// Function to populate random data into the input fields
function randomizeInputs() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson'];
    const genders = ['M', 'F'];

    document.getElementById('firstName').value = firstNames[Math.floor(Math.random() * firstNames.length)];
    document.getElementById('lastName').value = lastNames[Math.floor(Math.random() * lastNames.length)];
    document.getElementById('gender').value = genders[Math.floor(Math.random() * genders.length)];

    // Random DOB within a reasonable range (e.g., 18-65 years ago from current date)
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


// Event Listeners for buttons
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
    // After randomizing, optionally generate the license number automatically
    // document.getElementById('generateBtn').click(); // Uncomment this line if you want it to auto-generate after randomizing
});

// Optional: Generate a random set of inputs on page load
window.addEventListener('load', randomizeInputs);
// Function to generate a single fictional UK-style license number
// This function aims for a somewhat realistic (though randomized) 16-character format.
function generateFictionalUKLicenseNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let license = '';

    // Part 1: First 5 letters (fictional surname part)
    for (let i = 0; i < 5; i++) {
        license += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Part 2: Fictional DOB (YYMMDD format, e.g., 870312 for 12 March 1987)
    // Random year between 1950 and 2005 (for adult drivers)
    const year = String(Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950).slice(-2);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // Max 28 for simplicity

    license += year + month + day;

    // Part 3: Gender/Initial (fictional - usually first initial, could be M/F)
    license += Math.random() < 0.5 ? 'M' : 'F'; // Random M or F

    // Part 4: Remaining characters (to make it 16 total)
    const allChars = chars + numbers;
    const remainingLength = 16 - license.length;
    for (let i = 0; i < remainingLength; i++) {
        license += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return license;
}

// Function to generate and display N licenses (where N is 50 in your case)
function generateAndDisplayLicenses(count) {
    const container = document.getElementById('licenseListContainer');
    container.innerHTML = ''; // Clear previous content

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none'; // Remove bullet points
    ul.style.padding = '0';

    for (let i = 0; i < count; i++) {
        const licenseNumber = generateFictionalUKLicenseNumber();
        const li = document.createElement('li');
        li.textContent = licenseNumber;
        li.style.marginBottom = '5px'; // Add some spacing between items
        ul.appendChild(li);
    }
    container.appendChild(ul);
}

// Function to copy all generated licenses to the clipboard
function copyAllLicenses() {
    const container = document.getElementById('licenseListContainer');
    // Get text content, split by lines, filter out empty lines, join back with newlines
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

// Optional: Generate licenses immediately when the page loads
// Uncomment the line below if you want 50 licenses to appear automatically on page load
// window.addEventListener('load', () => {
//     generateAndDisplayLicenses(50);
// });
