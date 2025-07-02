// --- Unified Modal, Donation, and Form Logic ---

// --- Hamburger Menu ---
const hamburgerMenu = document.getElementById('hamburger-menu');
const mainNav = document.getElementById('main-nav');
hamburgerMenu.addEventListener('click', () => {
  mainNav.classList.toggle('active');
});

// --- Newsletter Subscribe Form ---
const newsletterForm = document.getElementById('newsletter-subscribe-form');
const newsletterStatus = document.getElementById('newsletter-status');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if (email.trim() !== '') {
      newsletterStatus.textContent = 'Subscribed successfully!';
      newsletterForm.reset();
    } else {
      newsletterStatus.textContent = 'Please enter a valid email.';
    }
  });
}

// --- Contact Form Submission ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
      formStatus.textContent = 'Message sent successfully!';
      contactForm.reset();
    } else {
      formStatus.textContent = 'Please fill in all fields.';
    }
  });
}

// --- Project Modals ---
const readMoreButtons = document.querySelectorAll('.read-more-btn');
const projectModals = document.querySelectorAll('.project-modal');
const closeButtons = document.querySelectorAll('.project-modal .close-btn');

readMoreButtons.forEach(button => {
  const targetModal = button.dataset.modal;
  if (targetModal) {
    button.addEventListener('click', () => {
      const modal = document.getElementById(targetModal);
      modal.classList.add('active', 'fade-in');
      setTimeout(() => modal.classList.remove('fade-in'), 300);
    });
  }
});

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.project-modal');
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.classList.remove('fade-out');
      modal.classList.remove('active');
    }, 300);
  });
});

// --- Donation Modal Logic ---
const modal = document.getElementById('donation-modal');
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtn = modal.querySelector('.close-btn');
const donateNowBtn = modal.querySelector('.donate-now-btn');

const donationAmountBtns = modal.querySelectorAll('.donation-amount-btn');
const customAmountInput = document.getElementById('custom-amount');

const visaDetails = document.getElementById('visa-details');
const mobileDetails = document.getElementById('mobile-money-details');
const paymentRadios = document.querySelectorAll('input[name="payment-method"]');

openModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.add('active', 'fade-in');
    setTimeout(() => modal.classList.remove('fade-in'), 300);
  });
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('fade-out');
  setTimeout(() => {
    modal.classList.remove('fade-out');
    modal.classList.remove('active');
  }, 300);
});

paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'visa') {
      visaDetails.style.display = 'block';
      mobileDetails.style.display = 'none';
    } else {
      visaDetails.style.display = 'none';
      mobileDetails.style.display = 'block';
    }
  });
});

// Set default payment method visibility
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector('input[name="payment-method"]:checked').dispatchEvent(new Event("change"));
});

donationAmountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    donationAmountBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    customAmountInput.value = '';
  });
});

donateNowBtn.addEventListener('click', (e) => {
  e.preventDefault();

  let amount = '';
  const selectedBtn = document.querySelector('.donation-amount-btn.selected');
  if (selectedBtn) {
    amount = selectedBtn.dataset.amount;
  } else {
    amount = customAmountInput.value;
  }

  if (!amount || parseFloat(amount) <= 0) {
    alert("Please select or enter a valid donation amount.");
    return;
  }

  const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;

  if (selectedMethod === 'visa') {
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiry = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
      alert("Enter a valid 16-digit card number.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Enter a valid expiry date in MM/YY format.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      alert("Enter a valid 3-4 digit CVV.");
      return;
    }
  } else if (selectedMethod === 'mobilemoney') {
    const network = document.getElementById('mobile-network').value;
    const number = document.getElementById('mobile-number').value.trim();

    if (!network) {
      alert("Please select your mobile network.");
      return;
    }

    if (!/^\+233\d{9}$/.test(number)) {
      alert("Enter a valid mobile money number in +233 format.");
      return;
    }
  }

  // Redirect to Paystack
  const handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your Paystack public key
    email: 'donor@example.com', // You may dynamically collect this from a form field
    amount: parseFloat(amount) * 100, // Paystack amount is in kobo (or pesewas)
    currency: 'GHS',
    callback: function(response) {
      window.location.href = 'thank-you.html';
    },
    onClose: function() {
      alert('Donation window closed.');
    }
  });
  handler.openIframe();
});
