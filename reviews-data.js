// Google Reviews Data
// To update reviews: Copy real reviews from Google Maps and update this array
// Format: { name, rating (1-5), text, date }

const googleReviews = [
  {
    name: "Luka Petak",
    rating: 5,
    text: "Predavanja su bila jasna, zanimljiva i jako dobro organizirana. Posebno bih pohvalio instruktora Nikolu Božinića, koji je uvijek imao strpljenja i znao odlično objasniti sve što treba.",
    date: "lipnja 2024."
  },
  {
    name: "Dario Galinec",
    rating: 5,
    text: "Autoškola Božinić je odličan izbor za sve koji žele naučiti voziti. Instruktori su strpljivi i profesionalni, a nastava je jasna i razumljiva. Vozila su moderna i dobro održavana, a cijene su pristupačne. Sve u svemu, toplo preporučujem ovu autoškolu.",
    date: "lipnja 2024."
  },
  {
    name: "Nino Bančić",
    rating: 5,
    text: "Svakome tko se odluči upisati u autoškolu toplo preporučam L-PROM-BOŽINIĆ! Ekipa je više nego profesionalna, a posebno bi istaknuo instruktora Nikolu koji je odličan.",
    date: "lipnja 2024."
  },
  {
    name: "Luka Kušter",
    rating: 5,
    text: "Predavanja su sjajna i super objašnjena ako se prati na predavanju ne bi trebalo biti problema na ispitu, vožnja je zabavna i uzbudljiva instruktor uvijek daje konstruktivne savjete.",
    date: "lipnja 2024."
  },
  {
    name: "Patrik Kovač",
    rating: 5,
    text: "Odlična autoškola, ekipa uvijek na raspolaganju i željna pomoći, predavanja zabavna i jasna. Velik izbor automobila u paketu s odličnim instruktorima. Hvala instruktoru Nikoli koji je svoje znanje i vještine trudom i mirnoćom prenosio na mene.",
    date: "lipnja 2024."
  },
  {
    name: "Ivona Zver",
    rating: 5,
    text: "Sve u svemu, zadovoljna sam autoškolom. Iako mi je cijeli proces osobno bio malo stresniji nego što je možda nekima, sve je proteklo sasvim u redu. Instruktor je bio strpljiv i profesionalan.",
    date: "lipnja 2024."
  },
];

// Calculate average rating
function getAverageRating() {
  if (googleReviews.length === 0) return 0;
  const sum = googleReviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / googleReviews.length).toFixed(1);
}

// Generate star HTML
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="star filled">★</span>';
    } else {
      stars += '<span class="star">★</span>';
    }
  }
  return stars;
}

// Render reviews
function renderReviews() {
  const reviewsList = document.querySelector('.reviews-list');
  const ratingNumber = document.querySelector('.rating-number');
  
  if (!reviewsList) return;
  
  // Update average rating
  if (ratingNumber) {
    ratingNumber.textContent = getAverageRating();
  }
  
  // Render review cards
  reviewsList.innerHTML = googleReviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-name">${review.name}</div>
          <div class="review-date">${review.date}</div>
        </div>
        <div class="review-rating">
          ${generateStars(review.rating)}
        </div>
      </div>
      <div class="review-text">${review.text}</div>
    </div>
  `).join('');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderReviews);
} else {
  renderReviews();
}

