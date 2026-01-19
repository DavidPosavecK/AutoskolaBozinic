// Google Sheets Integration for News/Notifications
// Instructions:
// 1. Create a Google Sheet with columns: Date, Title, Content, Category (optional)
// 2. Go to File > Share > Publish to web
// 3. Choose "Web page" or "CSV" format
// 4. Copy the published URL and paste it below
// 5. Or use Google Sheets API (requires API key)

// Option 1: Published Google Sheet as CSV/JSON (Free, no API key needed)
// Replace this URL with your published Google Sheet URL
// Format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQAwUBRv76S9mTbM7hYofeZNh9dc4-jmdHOLYYwJV1Lx0JHsiAyfhHkoXcAjS-FY5z7XgD9AftgyEdK/pub?output=csv';

// Option 2: Use Google Sheets API (requires API key setup)
const USE_API = false; // Set to true if using API
const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE';
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';

// Fallback data (shown if sheet can't be loaded)
const fallbackNews = [
  {
    date: new Date('2025-01-15'),
    title: 'Dobrodošli na našu novu web stranicu!',
    content: 'Radujemo se što možemo podijeliti najnovije informacije s vama putem naše nove web stranice.',
    category: 'Općenito'
  },
  {
    date: new Date('2025-01-10'),
    title: 'Nova vozila u floti',
    content: 'Proširili smo našu flotu vozila novim, modernim automobilima za još bolje iskustvo vožnje.',
    category: 'Novosti'
  }
];

// Format date as DD.MM.YYYY.
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}.`;
}

// Parse Google Sheets JSON response
function parseSheetData(data) {
  const rows = data.table.rows;
  const headers = data.table.cols.map(col => col.label || '');
  
  return rows.map((row, index) => {
    if (index === 0) return null; // Skip header row
    
    const cells = row.c;
    const newsItem = {};
    
    cells.forEach((cell, colIndex) => {
      const header = headers[colIndex]?.toLowerCase() || '';
      const value = cell?.v || '';
      
      if (header.includes('datum') || header.includes('date')) {
        newsItem.date = new Date(value);
      } else if (header.includes('naslov') || header.includes('title')) {
        newsItem.title = value;
      } else if (header.includes('sadržaj') || header.includes('content') || header.includes('tekst')) {
        newsItem.content = value;
      } else if (header.includes('kategorija') || header.includes('category')) {
        newsItem.category = value;
      }
    });
    
    return newsItem.title ? newsItem : null;
  }).filter(item => item !== null);
}

// Fetch from published Google Sheet
async function fetchFromPublishedSheet() {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const text = await response.text();
    
    // Check if it's CSV format
    if (GOOGLE_SHEET_URL.includes('output=csv') || text.includes(',')) {
      return parseCSVData(text);
    }
    
    // Try JSON format (google.visualization.Query.setResponse)
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1]);
      return parseSheetData(data);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from published sheet:', error);
    return null;
  }
}

// Parse date from DD.MM.YYYY. format
function parseDate(dateString) {
  if (!dateString) return new Date();
  
  const trimmed = dateString.trim();
  
  // Try DD.MM.YYYY. format
  const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1], 10);
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(ddmmyyyyMatch[3], 10);
    return new Date(year, month, day);
  }
  
  // Fallback to standard Date parsing
  return new Date(trimmed);
}

// Parse CSV data from Google Sheets
function parseCSVData(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;
  
  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find column indices
  const dateIndex = headers.findIndex(h => h.includes('datum') || h.includes('date'));
  const titleIndex = headers.findIndex(h => h.includes('naslov') || h.includes('title'));
  const contentIndex = headers.findIndex(h => h.includes('sadržaj') || h.includes('content') || h.includes('tekst'));
  const categoryIndex = headers.findIndex(h => h.includes('kategorija') || h.includes('category'));
  
  if (titleIndex === -1) return null;
  
  // Parse data rows
  const newsItems = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quoted fields
    const row = parseCSVLine(lines[i]);
    
    if (row.length === 0 || !row[titleIndex]) continue;
    
    const newsItem = {
      title: row[titleIndex]?.trim() || ''
    };
    
    if (dateIndex !== -1 && row[dateIndex]) {
      newsItem.date = parseDate(row[dateIndex]);
    } else {
      newsItem.date = new Date(); // Default to today if no date
    }
    
    if (contentIndex !== -1 && row[contentIndex]) {
      newsItem.content = row[contentIndex].trim();
    }
    
    if (categoryIndex !== -1 && row[categoryIndex]) {
      newsItem.category = row[categoryIndex].trim();
    }
    
    if (newsItem.title) {
      newsItems.push(newsItem);
    }
  }
  
  return newsItems;
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(field => field.trim().replace(/^"|"$/g, ''));
}

// Fetch from Google Sheets API
async function fetchFromAPI() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/A1:Z1000?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values || data.values.length < 2) return null;
    
    const headers = data.values[0].map(h => h.toLowerCase());
    const rows = data.values.slice(1);
    
    return rows.map(row => {
      const newsItem = {};
      headers.forEach((header, index) => {
        const value = row[index] || '';
        
        if (header.includes('datum') || header.includes('date')) {
          newsItem.date = new Date(value);
        } else if (header.includes('naslov') || header.includes('title')) {
          newsItem.title = value;
        } else if (header.includes('sadržaj') || header.includes('content') || header.includes('tekst')) {
          newsItem.content = value;
        } else if (header.includes('kategorija') || header.includes('category')) {
          newsItem.category = value;
        }
      });
      
      return newsItem.title ? newsItem : null;
    }).filter(item => item !== null);
  } catch (error) {
    console.error('Error fetching from API:', error);
    return null;
  }
}

// Display news items
function displayNews(newsItems) {
  const newsList = document.getElementById('news-list');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');
  
  if (loadingMessage) loadingMessage.style.display = 'none';
  
  if (!newsItems || newsItems.length === 0) {
    if (errorMessage) errorMessage.style.display = 'block';
    if (newsList) {
      newsList.innerHTML = '<p style="text-align: center; color: #ccc;">Trenutno nema obavijesti.</p>';
    }
    return;
  }
  
  if (errorMessage) errorMessage.style.display = 'none';
  
  // Sort by date (newest first)
  newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (newsList) {
    newsList.innerHTML = newsItems.map(item => `
      <article class="news-item">
        <div class="news-header">
          <div class="news-date">${formatDate(item.date)}</div>
          ${item.category ? `<span class="news-category">${item.category}</span>` : ''}
        </div>
        <h2 class="news-title">${escapeHtml(item.title)}</h2>
        <div class="news-content">${formatContent(item.content)}</div>
      </article>
    `).join('');
  }
}

// Format content (preserve line breaks)
function formatContent(content) {
  if (!content) return '';
  return escapeHtml(content).replace(/\n/g, '<br>');
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load news
async function loadNews() {
  let newsItems = null;
  
  if (USE_API && GOOGLE_SHEET_ID && GOOGLE_API_KEY) {
    newsItems = await fetchFromAPI();
  } else if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_SHEET_URL_HERE') {
    newsItems = await fetchFromPublishedSheet();
  }
  
  // Use fallback if no data loaded
  if (!newsItems || newsItems.length === 0) {
    newsItems = fallbackNews;
  }
  
  displayNews(newsItems);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNews);
} else {
  loadNews();
}

