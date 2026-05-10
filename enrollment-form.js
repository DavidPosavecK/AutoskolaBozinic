// Enrollment form handler (modal + standalone page)
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('enrollmentModal');
  const isModalMode = !!modal;
  const enrollButtons = document.querySelectorAll('.enroll-btn');
  const closeBtn = document.querySelector('.modal-close');
  const form = document.getElementById('enrollmentForm');

  // Polja za A/A2 postojeću kategoriju
  const existingCategoryGroup = document.getElementById('existingCategoryGroup');
  const existingCategorySelect = document.getElementById('postojeca_kategorija');
  const existingCategoryOtherWrap = document.getElementById('existingCategoryOtherWrap');
  const existingCategoryOtherInput = document.getElementById('postojeca_kategorija_ostalo');
  const brojVozackeGroup = document.getElementById('brojVozackeGroup');
  const guardianSection = document.getElementById('guardianSection');

  function showError(msg, el) {
    alert(msg);
    if (el) el.focus();
  }

  // Otvori modal (ako postoji na stranici)
  enrollButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      if (!isModalMode) return;
      e.preventDefault();
      modal.style.display = 'flex'; modal.classList.add('flex'); modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      modal.scrollTop = 0;

      // reset “postojeća kategorija” UI kada se otvori
      updateExistingCategoryVisibility();
      updateExistingCategoryOtherVisibility();
      updateBrojVozackeVisibility();
      updateGuardianVisibility();
    });
  });

  // Zatvori modal
  function closeModal() {
    if (!isModalMode) return;
    modal.style.display = 'none'; modal.classList.add('hidden'); modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (isModalMode) {
    window.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!isModalMode) return;
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

  const brojVozackeInput = form ? form.querySelector('[name="broj_vozacke"]') : null;
  const datumRodenjaInput = form ? form.querySelector('[name="datum_rodenja"]') : null;
  const imeRoditeljaInput = form ? form.querySelector('[name="ime_roditelja"]') : null;
  const adresaSkrbnikaInput = form ? form.querySelector('[name="adresa_skrbnika"]') : null;
  const oibSkrbnikaInput = form ? form.querySelector('[name="oib_skrbnika"]') : null;

  function parseDmyDate(s) {
    const raw = String(s || '').trim();
    if (!raw) return null;
    const normalized = raw.replace(/\./g, '/').replace(/\s+/g, '');
    const parts = normalized.split('/').map((p) => p.trim()).filter(Boolean);
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return null;
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  /** Izlaz: DD/MM/GGGG */
  function formatDmySlash(date) {
    if (!date || isNaN(date.getTime())) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
  }

  /** true ako kandidat još nema 18 godina (na današnji dan). */
  function isKandidatMaloljetan(birthDate) {
    if (!birthDate || isNaN(birthDate.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  }

  function updateGuardianVisibility() {
    if (!guardianSection || !datumRodenjaInput) return;
    const birth = parseDmyDate(datumRodenjaInput.value);
    const minor = birth ? isKandidatMaloljetan(birth) : false;

    if (minor) {
      guardianSection.style.display = '';
      if (imeRoditeljaInput) imeRoditeljaInput.required = true;
      if (adresaSkrbnikaInput) adresaSkrbnikaInput.required = true;
      if (oibSkrbnikaInput) oibSkrbnikaInput.required = true;
    } else {
      guardianSection.style.display = 'none';
      if (imeRoditeljaInput) {
        imeRoditeljaInput.required = false;
        imeRoditeljaInput.value = '';
      }
      if (adresaSkrbnikaInput) {
        adresaSkrbnikaInput.required = false;
        adresaSkrbnikaInput.value = '';
      }
      if (oibSkrbnikaInput) {
        oibSkrbnikaInput.required = false;
        oibSkrbnikaInput.value = '';
      }
    }
  }

  // Auto-format DD/MM/GGGG so mobile users (numeric keypad, no "/" key)
  // can just type 8 digits and slashes get inserted automatically.
  function formatDateInput(input) {
    const cursorAtEnd = input.selectionStart === input.value.length;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    if (input.value !== formatted) {
      input.value = formatted;
      if (cursorAtEnd) {
        try { input.setSelectionRange(formatted.length, formatted.length); } catch (_) {}
      }
    }
  }

  if (datumRodenjaInput) {
    datumRodenjaInput.addEventListener('input', function () {
      formatDateInput(this);
      updateGuardianVisibility();
    });
    datumRodenjaInput.addEventListener('change', updateGuardianVisibility);
  }

  function updateBrojVozackeVisibility() {
    if (!brojVozackeGroup || !brojVozackeInput) return;
    const checked = document.querySelector('input[name="posjeduje_vozacku"]:checked');
    const isDa = checked && checked.value === 'da';

    if (isDa) {
      brojVozackeGroup.style.display = 'block';
      brojVozackeInput.required = true;
    } else {
      brojVozackeGroup.style.display = 'none';
      brojVozackeInput.required = false;
      brojVozackeInput.value = '';
    }
  }

  document.querySelectorAll('input[name="posjeduje_vozacku"]').forEach((rb) => {
    rb.addEventListener('change', updateBrojVozackeVisibility);
  });

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

      const datumRodenjaVal = (formData.get('datum_rodenja') || '').trim();
      const birthDate = parseDmyDate(datumRodenjaVal);
      if (!birthDate) {
        return showError(
          'Molimo upišite datum rođenja u obliku DD/MM/GGGG (dan/mjesec/godina), npr. 08/05/2008.',
          datumRodenjaInput
        );
      }
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (birthDate > todayStart) {
        return showError('Datum rođenja ne može biti u budućnosti.', datumRodenjaInput);
      }

      const mjestoRodenjaRaw = (formData.get('mjesto_rodenja') || '').trim();
      const mjestoRodenjaEl = form.querySelector('[name="mjesto_rodenja"]');
      if (!mjestoRodenjaRaw) {
        return showError('Molimo upišite mjesto rođenja.', mjestoRodenjaEl);
      }

      // OIB validacija
      const oibRaw = (formData.get('oib') || '').trim();
      const oibEl = form.querySelector('[name="oib"]');

      if (!oibRaw) return showError('Molimo upišite OIB.', oibEl);
      if (!/^\d{11}$/.test(oibRaw)) {
        return showError('OIB mora sadržavati točno 11 znamenki i ne smije sadržavati slova ili razmake.', oibEl);
      }

      const posjedujeVozacku = (formData.get('posjeduje_vozacku') || '').trim();
      const posjedujeEl = form.querySelector('input[name="posjeduje_vozacku"]');

      if (!posjedujeVozacku) {
        return showError('Molimo odgovorite posjedujete li vozačku.', posjedujeEl);
      }

      // BROJ VOZAČKE (HR) samo ako posjeduje vozačku: 7 ili 8 znamenki
      const brojVozackeRaw = (formData.get('broj_vozacke') || '').trim();
      const brojVozackeEl = form.querySelector('[name="broj_vozacke"]');

      if (posjedujeVozacku === 'da') {
        if (!brojVozackeRaw) {
          return showError('Molimo upišite broj vozačke dozvole.', brojVozackeEl);
        }
        if (!/^\d{7,8}$/.test(brojVozackeRaw)) {
          return showError('Broj vozačke dozvole mora imati 7 ili 8 znamenki (bez razmaka i slova).', brojVozackeEl);
        }
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

      const kandidatMaloljetan = isKandidatMaloljetan(birthDate);
      const adresaSkrbnikaRaw = (formData.get('adresa_skrbnika') || '').trim();
      const adresaSkrbnikaEl = form.querySelector('[name="adresa_skrbnika"]');
      const imeRoditeljaRaw = (formData.get('ime_roditelja') || '').trim();
      const imeRoditeljaEl = form.querySelector('[name="ime_roditelja"]');
      const oibSkrbnikaRaw = (formData.get('oib_skrbnika') || '').trim();
      const oibSkrbnikaEl = form.querySelector('[name="oib_skrbnika"]');

      if (kandidatMaloljetan) {
        if (!imeRoditeljaRaw) {
          return showError('Molimo upišite ime i prezime roditelja / skrbnika.', imeRoditeljaEl);
        }
        if (!adresaSkrbnikaRaw) {
          return showError('Molimo upišite adresu i poštanski broj skrbnika.', adresaSkrbnikaEl);
        }
        if (!oibSkrbnikaRaw) {
          return showError('Molimo upišite OIB roditelja / skrbnika.', oibSkrbnikaEl);
        }
        if (!/^\d{11}$/.test(oibSkrbnikaRaw)) {
          return showError('OIB roditelja / skrbnika mora sadržavati točno 11 znamenki i ne smije sadržavati slova ili razmake.', oibSkrbnikaEl);
        }
      }

      const datumRodenjaFormatted = formatDmySlash(birthDate);
      const guardianEmailBlock = kandidatMaloljetan
        ? `--- RODITELJ / SKRBNIK ---
IME I PREZIME RODITELJA/SKRBNIKA: ${imeRoditeljaRaw}
ADRESA I POŠTANSKI BROJ SKRBNIKA: ${adresaSkrbnikaRaw}
OIB RODITELJA/SKRBNIKA: ${oibSkrbnikaRaw}`
        : '--- RODITELJ / SKRBNIK ---\nKandidat punoljetan (18+); podaci skrbnika nisu potrebni.';

      // Build email body
      const emailBody = `
NOVA PRIJAVA ZA AUTOŠKOLU BOŽINIĆ
=====================================

--- KANDIDAT ---
IME I PREZIME: ${formData.get('ime_prezime')}
DATUM ROĐENJA: ${datumRodenjaFormatted}
MJESTO ROĐENJA: ${mjestoRodenjaRaw}
ADRESA I POŠTANSKI BROJ (KANDIDAT): ${formData.get('adresa')}
BROJ TELEFONA/MOBITELA: ${formData.get('telefon')}
E-MAIL ADRESA: ${emailRaw}

KATEGORIJA: ${selectedCategory}
POSTOJEĆA KATEGORIJA: ${postojecaZaEmail}

POSJEDUJE VOZAČKU: ${posjedujeVozacku === 'da' ? 'Da' : 'Ne'}
BROJ VOZAČKE DOZVOLE: ${posjedujeVozacku === 'da' ? brojVozackeRaw : 'Ne posjeduje / nije uneseno'}
OIB KANDIDATA: ${oibRaw}

${guardianEmailBlock}

--- LIJEČNIČKO UVJERENJE ---
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
        web3formData.append('replyto', emailRaw || 'Info.autoskolabozinic@gmail.com');
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
          if (isModalMode) {
            closeModal();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }

          // reset UI nakon reseta
          updateExistingCategoryVisibility();
          updateExistingCategoryOtherVisibility();
          updateBrojVozackeVisibility();
          updateGuardianVisibility();
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

  if (form) {
    updateExistingCategoryVisibility();
    updateExistingCategoryOtherVisibility();
    updateBrojVozackeVisibility();
    updateGuardianVisibility();
  }
});
