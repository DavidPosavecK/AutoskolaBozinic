// Enrollment Form Modal Handler
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('enrollmentModal');
  const enrollButtons = document.querySelectorAll('.enroll-btn');
  const closeBtn = document.querySelector('.modal-close');
  const form = document.getElementById('enrollmentForm');

  // Open modal when any enroll button is clicked
  enrollButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside modal
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      
      // Get selected categories
      const categories = [];
      document.querySelectorAll('input[name="kategorija"]:checked').forEach(checkbox => {
        categories.push(checkbox.value);
      });

      // Build simple email body
      const emailBody = `
NOVA PRIJAVA ZA AUTOŠKOLU BOŽINIĆ
=====================================

IME I PREZIME: ${formData.get('ime_prezime')}
IME I PREZIME RODITELJA/SKRBNIKA: ${formData.get('ime_roditelja')}
DATUM I MJESTO ROĐENJA: ${formData.get('datum_mjesto_rodenja')}
ADRESA I POŠTANSKI BROJ: ${formData.get('adresa')}
BROJ TELEFONA/MOBITELA: ${formData.get('telefon')}
E-MAIL ADRESA: ${formData.get('email') || 'Nije navedeno'}

KATEGORIJA: ${categories.join(', ')}

OIB: ${formData.get('oib')}
BROJ LIJEČNIČKOG UVJERENJA: ${formData.get('broj_uvjerenja')}
MJESTO I VRIJEME IZDAVANJA: ${formData.get('mjesto_vrijeme_izdavanja')}

DODATNA NAPOMENA:
${formData.get('napomena') || 'Nema dodatnih napomena'}

SUGLASNOST: DA

Poslano: ${new Date().toLocaleString('hr-HR')}
      `.trim();

      // Submit via Web3Forms (free service, no account needed)
      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Šaljem...';
        submitBtn.disabled = true;

        // Prepare form data for Web3Forms
        const web3formData = new FormData();
        web3formData.append('access_key', '76b7e2cd-8875-4a33-9dfa-eb33bf7f959b');
        web3formData.append('subject', `Nova prijava - ${formData.get('ime_prezime')} - ${categories.join(', ')}`);
        web3formData.append('from_name', formData.get('ime_prezime'));
        web3formData.append('replyto', formData.get('email') || 'd.posaveckovac@gmail.com');
        web3formData.append('message', emailBody);
        
        // Add all form fields
        for (let [key, value] of formData.entries()) {
          if (key !== 'kategorija') {
            web3formData.append(key, value);
          }
        }
        web3formData.append('kategorija', categories.join(', '));

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3formData
        });

        const data = await response.json();

        if (data.success) {
          alert('Uspješno ste poslali prijavu! Kontaktirat ćemo vas uskoro.');
          form.reset();
          closeModal();
        } else {
          throw new Error(data.message || 'Greška pri slanju');
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

      } catch (error) {
        console.error('Error:', error);
        alert('Došlo je do greške pri slanju prijave. Molimo pokušajte ponovno ili nas kontaktirajte putem telefona: 042 783 750');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Pošalji';
        submitBtn.disabled = false;
      }
    });
  }
});
