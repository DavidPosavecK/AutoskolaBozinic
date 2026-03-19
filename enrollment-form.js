// Enrollment Form Modal Handler
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('enrollmentModal');
  const enrollButtons = document.querySelectorAll('.enroll-btn');
  const closeBtn = document.querySelector('.modal-close');
  const form = document.getElementById('enrollmentForm');

  // Polja za A/A2 postojeću kategoriju
  const existingCategoryGroup = document.getElementById('existingCategoryGroup');
  const existingCategorySelect = document.getElementById('postojeca_kategorija');
  const existingCategoryOtherWrap = document.getElementById('existingCategoryOtherWrap');
  const existingCategoryOtherInput = document.getElementById('postojeca_kategorija_ostalo');

  function showError(msg, el) {
    alert(msg);
    if (el) el.focus();
  }

  // Otvori modal
  enrollButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      modal.style.display = 'flex'; modal.classList.add('flex'); modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      modal.scrollTop = 0;

      // reset “postojeća kategorija” UI kada se otvori
      updateExistingCategoryVisibility();
      updateExistingCategoryOtherVisibility();
    });
  });

  // Zatvori modal
  function closeModal() {
    modal.style.display = 'none'; modal.classList.add('hidden'); modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  function getSelectedCategory() {
    const checked = document.querySelector('input[name="kategorija"]:checked');
    return checked ? checked.value : '';
  }

  // Prikaži dropdown samo za A i A2
  function updateExistingCategoryVisibility() {
    const selectedCategory = getSelectedCategory();

    const requiresExisting =
      selectedCategory === 'A KATEGORIJA' || selectedCategory === 'A2 KATEGORIJA';

    if (!existingCategoryGroup || !existingCategorySelect) return;

    if (requiresExisting) {
      existingCategoryGroup.style.display = 'block';
      existingCategorySelect.required = true;
    } else {
      existingCategoryGroup.style.display = 'none';
      existingCategorySelect.required = false;
      existingCategorySelect.value = '';

      if (existingCategoryOtherWrap) existingCategoryOtherWrap.style.display = 'none';
      if (existingCategoryOtherInput) {
        existingCategoryOtherInput.required = false;
        existingCategoryOtherInput.value = '';
      }
    }
  }

  // Ako je “Ostalo” pokaži input
  function updateExistingCategoryOtherVisibility() {
    if (!existingCategorySelect || !existingCategoryOtherWrap || !existingCategoryOtherInput) return;

    const isOther = existingCategorySelect.value === 'Ostalo';

    if (isOther) {
      existingCategoryOtherWrap.style.display = 'block';
      existingCategoryOtherInput.required = true;
    } else {
      existingCategoryOtherWrap.style.display = 'none';
      existingCategoryOtherInput.required = false;
      existingCategoryOtherInput.value = '';
    }
  }

  // Listeneri za radio kategorije
  document.querySelectorAll('input[name="kategorija"]').forEach((rb) => {
    rb.addEventListener('change', function () {
      updateExistingCategoryVisibility();
      updateExistingCategoryOtherVisibility();
    });
  });

  // Listener za dropdown postojeće kategorije
  if (existingCategorySelect) {
    existingCategorySelect.addEventListener('change', updateExistingCategoryOtherVisibility);
  }

  // Submit
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const selectedCategory = formData.get('kategorija') || '';

      // Ako iz nekog razloga nije odabrano (iako je required), javi grešku
      if (!selectedCategory) {
        return showError('Molimo odaberite kategoriju koju polažete.', form.querySelector('input[name="kategorija"]'));
      }

      // EMAIL validacija (obavezno)
      const emailRaw = (formData.get('email') || '').trim();
      const emailEl = form.querySelector('[name="email"]');

      if (!emailRaw) {
        return showError('Molimo upišite e-mail adresu.', emailEl);
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw);
      if (!emailOk) {
        return showError('Molimo upišite valjanu e-mail adresu (npr. ime@domena.hr).', emailEl);
      }

      // OIB validacija
      const oibRaw = (formData.get('oib') || '').trim();
      const oibEl = form.querySelector('[name="oib"]');

      if (!oibRaw) return showError('Molimo upišite OIB.', oibEl);
      if (!/^\d{11}$/.test(oibRaw)) {
        return showError('OIB mora sadržavati točno 11 znamenki i ne smije sadržavati slova ili razmake.', oibEl);
      }

      // BROJ VOZAČKE (HR) obavezno: 7 ili 8 znamenki
      const brojVozackeRaw = (formData.get('broj_vozacke') || '').trim();
      const brojVozackeEl = form.querySelector('[name="broj_vozacke"]');

      if (!brojVozackeRaw) {
        return showError('Molimo upišite broj vozačke dozvole.', brojVozackeEl);
      }
      if (!/^\d{7,8}$/.test(brojVozackeRaw)) {
        return showError('Broj vozačke dozvole mora imati 7 ili 8 znamenki (bez razmaka i slova).', brojVozackeEl);
      }

      // Ako je A ili A2 -> postojeća kategorija obavezna
      const requiresExisting =
        selectedCategory === 'A KATEGORIJA' || selectedCategory === 'A2 KATEGORIJA';

      const postojecaKat = (formData.get('postojeca_kategorija') || '').trim();
      const postojecaKatOstalo = (formData.get('postojeca_kategorija_ostalo') || '').trim();

      if (requiresExisting) {
        if (!postojecaKat) {
          return showError('Ako upisujete A ili A2 kategoriju, morate odabrati koju kategoriju posjedujete.', existingCategorySelect);
        }
        if (postojecaKat === 'Ostalo' && !postojecaKatOstalo) {
          return showError('Molimo upišite koju kategoriju posjedujete (Ostalo).', existingCategoryOtherInput);
        }
      }

      const postojecaZaEmail = requiresExisting
        ? (postojecaKat === 'Ostalo' ? `Ostalo: ${postojecaKatOstalo}` : postojecaKat)
        : 'Nije potrebno / nije navedeno';

      // Build email body
      const emailBody = `
NOVA PRIJAVA ZA AUTOŠKOLU BOŽINIĆ
=====================================

IME I PREZIME: ${formData.get('ime_prezime')}
IME I PREZIME RODITELJA/SKRBNIKA: ${formData.get('ime_roditelja')}
DATUM I MJESTO ROĐENJA: ${formData.get('datum_mjesto_rodenja')}
ADRESA I POŠTANSKI BROJ: ${formData.get('adresa')}
BROJ TELEFONA/MOBITELA: ${formData.get('telefon')}
E-MAIL ADRESA: ${emailRaw}

KATEGORIJA: ${selectedCategory}
POSTOJEĆA KATEGORIJA: ${postojecaZaEmail}

OIB: ${oibRaw}
BROJ VOZAČKE DOZVOLE: ${brojVozackeRaw}
BROJ LIJEČNIČKOG UVJERENJA: ${formData.get('broj_uvjerenja')}
MJESTO I VRIJEME IZDAVANJA: ${formData.get('mjesto_vrijeme_izdavanja')}

DODATNA NAPOMENA:
${formData.get('napomena') || 'Nema dodatnih napomena'}

SUGLASNOST: DA

Poslano: ${new Date().toLocaleString('hr-HR')}
      `.trim();

      // Submit via Web3Forms
      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Šaljem...';
        submitBtn.disabled = true;

        const web3formData = new FormData();
        web3formData.append('access_key', '76b7e2cd-8875-4a33-9dfa-eb33bf7f959b');
        web3formData.append('subject', `Nova prijava - ${formData.get('ime_prezime')} - ${selectedCategory}`);
        web3formData.append('from_name', formData.get('ime_prezime'));
        web3formData.append('replyto', emailRaw || 'd.posaveckovac@gmail.com');
        web3formData.append('message', emailBody);

        // Add all form fields
        for (let [key, value] of formData.entries()) {
          if (key !== 'kategorija') {
            web3formData.append(key, value);
          }
        }
        web3formData.append('kategorija', selectedCategory);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: web3formData
        });

        const data = await response.json();

        if (data.success) {
          alert('Uspješno ste poslali prijavu! Kontaktirat ćemo vas uskoro.');
          form.reset();
          closeModal();

          // reset UI nakon reseta
          updateExistingCategoryVisibility();
          updateExistingCategoryOtherVisibility();
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
