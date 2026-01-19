# Google Sheets Setup za Obavijesti

## Kako postaviti Google Sheets integraciju

### Opcija 1: Published Sheet (Preporučeno - Besplatno, bez API ključa)

1. **Kreiraj Google Sheet:**
   - Otvori Google Sheets
   - Kreiraj novi sheet
   - Dodaj kolone: **Datum**, **Naslov**, **Sadržaj**, **Kategorija** (opcionalno)

2. **Primjer strukture:**
   ```
   | Datum        | Naslov                    | Sadržaj                          | Kategorija |
   |--------------|---------------------------|----------------------------------|------------|
   | 15.01.2025.  | Dobrodošli!               | Tekst obavijesti...              | Općenito   |
   | 10.01.2025.  | Nova vozila               | Dodali smo nova vozila...        | Novosti    |
   ```
   
   **Format datuma:** DD.MM.YYYY. (npr. 15.01.2025.)

3. **Objavi Sheet:**
   - Klikni **File** → **Share** → **Publish to web**
   - Odaberi **Web page** ili **CSV**
   - Klikni **Publish**
   - Kopiraj URL

4. **Dodaj URL u kod:**
   - Otvori `obavijesti.js`
   - Pronađi `GOOGLE_SHEET_URL`
   - Zamijeni `YOUR_GOOGLE_SHEET_URL_HERE` s tvojim URL-om
   - Format URL-a: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json`

### Opcija 2: Google Sheets API (Zahtijeva API ključ)

1. **Kreiraj Google Cloud Project:**
   - Idi na [Google Cloud Console](https://console.cloud.google.com/)
   - Kreiraj novi projekt
   - Omogući **Google Sheets API**

2. **Kreiraj API ključ:**
   - Idi na **Credentials**
   - Klikni **Create Credentials** → **API Key**
   - Kopiraj API ključ

3. **Podijeli Sheet:**
   - Otvori svoj Google Sheet
   - Klikni **Share** → **Get shareable link**
   - Postavi na **Anyone with the link can view**

4. **Dodaj u kod:**
   - Otvori `obavijesti.js`
   - Postavi `USE_API = true`
   - Dodaj `GOOGLE_SHEET_ID` (iz URL-a sheet-a)
   - Dodaj `GOOGLE_API_KEY`

## Format podataka

Sheet mora imati kolone (može biti bilo koji redoslijed):
- **Datum** ili **Date** - format: **DD.MM.YYYY.** (npr. 15.01.2025.)
- **Naslov** ili **Title** - naslov obavijesti
- **Sadržaj** ili **Content** ili **Tekst** - tekst obavijesti
- **Kategorija** ili **Category** (opcionalno) - kategorija obavijesti

## Testiranje

1. Dodaj nekoliko redaka u Sheet
2. Objavi Sheet (Opcija 1) ili postavi API (Opcija 2)
3. Otvori `obavijesti.html` u pregledniku
4. Provjeri da li se obavijesti učitavaju

## Troubleshooting

- **Ne učitava se:** Provjeri da li je Sheet javno dostupan
- **Pogrešan format:** Provjeri nazive kolona (mogu biti na hrvatskom ili engleskom)
- **CORS greška:** Koristi Opciju 2 (API) umjesto Published Sheet

