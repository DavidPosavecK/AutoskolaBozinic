// Google Reviews Data
// To update reviews: Copy real reviews from Google Maps and update this array
// Format: { name, rating (1-5), text, date }

const googleReviews = [
  {
    name: "Marko Horvat",
    rating: 5,
    text: "Odlična autoškola! Instruktori su strpljivi i profesionalni. Sve je bilo organizirano i jasno objašnjeno. Preporučujem svima!",
    date: "15. prosinca 2024."
  },
  {
    name: "Ana Marić",
    rating: 5,
    text: "Preporučujem svima! Nastava je kvalitetna, a instruktori su jako susretljivi. Hvala vam na svemu što ste mi pomogli da postanem siguran vozač.",
    date: "20. studenog 2024."
  },
  {
    name: "Ivan Novak",
    rating: 5,
    text: "Najbolja autoškola u gradu. Sve je bilo profesionalno i organizirano. Vozačku sam dobio bez problema. Instruktorica je bila strpljiva i odlična!",
    date: "10. listopada 2024."
  },
  {
    name: "Petra Kovač",
    rating: 5,
    text: "Fantastično iskustvo! Instruktorica je bila strpljiva i profesionalna. Nastava je bila zanimljiva i lako razumljiva. Preporučujem svima!",
    date: "5. rujna 2024."
  },
  {
    name: "Tomislav Babić",
    rating: 5,
    text: "Odlična autoškola s dugogodišnjim iskustvom. Instruktori su stručni i pristupačni. Sve preporuke!",
    date: "28. kolovoza 2024."
  },
  {
    name: "Maja Jurić",
    rating: 5,
    text: "Prekrasno iskustvo! Ljubazno osoblje, kvalitetna nastava i odlični instruktori. Hvala vam što ste mi pomogli da postanem siguran vozač!",
    date: "15. srpnja 2024."
  }
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

