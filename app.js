const suggestionStatus = document.getElementById("suggestions-status");
const suggestionsList = document.getElementById("suggestions-list");
const searchStatus = document.getElementById("search-status");
const searchResults = document.getElementById("search-results");
const searchForm = document.getElementById("search-form");
const refreshButton = document.getElementById("refresh-suggestions");

const WIKIPEDIA_LANG = "de";
const MAX_SUGGESTIONS = 8;

const createWikiUrl = (title) =>
  `https://${WIKIPEDIA_LANG}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;

const setStatus = (target, message) => {
  target.textContent = message;
};

const renderCards = (target, items) => {
  target.innerHTML = "";

  if (!items.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "card";

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.title;
    title.appendChild(link);

    const description = document.createElement("p");
    description.textContent = item.description;

    li.append(title, description);
    fragment.appendChild(li);
  }

  target.appendChild(fragment);
};

const isEligibleTopArticle = (name) => {
  if (!name) return false;
  if (name === "Hauptseite") return false;
  return !name.startsWith("Spezial:");
};

const fetchTopArticles = async () => {
  const today = new Date();
  const daysToTry = [1, 2, 3];

  for (const backDays of daysToTry) {
    const date = new Date(today);
    date.setDate(today.getDate() - backDays);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${WIKIPEDIA_LANG}.wikipedia/all-access/${year}/${month}/${day}`;

    const response = await fetch(url);
    if (!response.ok) continue;

    const data = await response.json();
    const articles = data?.items?.[0]?.articles ?? [];
    const filteredTitles = articles
      .map((entry) => entry.article)
      .filter(isEligibleTopArticle)
      .slice(0, MAX_SUGGESTIONS);

    if (filteredTitles.length) {
      return filteredTitles;
    }
  }

  return [];
};

const fetchSummary = async (title) => {
  const url = `https://${WIKIPEDIA_LANG}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data?.title) return null;

  return {
    title: data.title,
    description: data.extract || "Kein Beschreibungstext verfügbar.",
    url: data.content_urls?.desktop?.page || createWikiUrl(data.title)
  };
};

const loadSuggestions = async () => {
  setStatus(suggestionStatus, "Lade aktuelle Vorschläge …");
  suggestionsList.innerHTML = "";

  try {
    const topTitles = await fetchTopArticles();
    const summaries = await Promise.all(topTitles.map(fetchSummary));
    const cards = summaries.filter(Boolean);

    renderCards(suggestionsList, cards);

    if (cards.length) {
      setStatus(suggestionStatus, `Gefunden: ${cards.length} aktuelle Artikel.`);
    } else {
      setStatus(suggestionStatus, "Keine aktuellen Vorschläge gefunden.");
    }
  } catch (error) {
    setStatus(suggestionStatus, "Vorschläge konnten nicht geladen werden.");
  }
};

const searchWikipedia = async (query) => {
  const url = new URL(`https://${WIKIPEDIA_LANG}.wikipedia.org/w/api.php`);
  url.searchParams.set("action", "opensearch");
  url.searchParams.set("format", "json");
  url.searchParams.set("search", query);
  url.searchParams.set("limit", "10");
  url.searchParams.set("namespace", "0");
  url.searchParams.set("origin", "*");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Search request failed");
  }

  const data = await response.json();
  const titles = data?.[1] ?? [];
  const descriptions = data?.[2] ?? [];
  const links = data?.[3] ?? [];

  return titles.map((title, index) => ({
    title,
    description: descriptions[index] || "Keine Beschreibung verfügbar.",
    url: links[index] || createWikiUrl(title)
  }));
};

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const rawQuery = formData.get("query");
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  if (!query) return;

  setStatus(searchStatus, `Suche nach „${query}“ …`);
  searchResults.innerHTML = "";

  try {
    const results = await searchWikipedia(query);
    renderCards(searchResults, results);
    setStatus(searchStatus, `${results.length} Treffer gefunden.`);
  } catch (error) {
    setStatus(searchStatus, "Suche fehlgeschlagen. Bitte erneut versuchen.");
  }
});

refreshButton.addEventListener("click", () => {
  loadSuggestions();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Service worker optional.
    });
  });
}

loadSuggestions();
