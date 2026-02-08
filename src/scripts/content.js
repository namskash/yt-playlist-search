// CONSTANTS:
const SHEET_SELECTOR = "yt-contextual-sheet-layout.ytContextualSheetLayoutHost";

const HEADER_CONTAINER_SELECTOR = ".ytContextualSheetLayoutHeaderContainer";

const PLAYLIST_LIST_SELECTOR = "yt-list-view-model.ytListViewModelHost";

const PLAYLIST_ITEM_SELECTOR =
  "yt-list-item-view-model.yt-list-item-view-model";

const PLAYLIST_TITLE_SELECTOR = ".yt-list-item-view-model__title";

// OBSERVER:
const observer = new MutationObserver(() => {
  const sheet = document.querySelector(SHEET_SELECTOR);
  if (!sheet) {
    console.log("The SHEET_SELECTOR needs to be changed!");
    return;
  }

  const headerContainer = sheet.querySelector(HEADER_CONTAINER_SELECTOR);
  if (!headerContainer) {
    console.log("The HEADER_CONTAINER_SELECTOR needs to be changed!");
  }

  const existingInput = sheet.querySelector("#playlist-search-box");

  if (headerContainer && !existingInput) {
    resizeSheet(sheet);
    insertPlaylistSearchBox(headerContainer, sheet);
  }

  if (existingInput) {
    requestAnimationFrame(() => {
      existingInput.focus();
      observer.disconnect();
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// INSERT SEARCH BAR:
function insertPlaylistSearchBox(headerContainer, sheet) {
  const inputWrapper = document.createElement("yt-panel-header-view-model");
  inputWrapper.className = "ytd-playlist-search-input-container";

  const searchInput = document.createElement("input");
  searchInput.id = "playlist-search-box";
  searchInput.placeholder = "Search Playlists...";
  searchInput.className = "ytd-playlist-search-input";

  // Prevent popup dismissal
  ["mousedown", "click", "keydown"].forEach((evt) =>
    searchInput.addEventListener(evt, (e) => e.stopPropagation()),
  );

  inputWrapper.appendChild(searchInput);
  headerContainer.prepend(inputWrapper);

  const getPlaylists = () =>
    Array.from(sheet.querySelectorAll(PLAYLIST_ITEM_SELECTOR));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    getPlaylists().forEach((playlist) => {
      const titleEl = playlist.querySelector(PLAYLIST_TITLE_SELECTOR);

      const name = titleEl?.innerText.toLowerCase() || "";
      playlist.style.display = name.includes(query) ? "" : "none";
    });
  });
}

// RESIZE CONTAINER
function resizeSheet(sheet) {
  sheet.style.maxHeight = "400vh";
  sheet.style.height = "400vh";

  const list = sheet.querySelector(PLAYLIST_LIST_SELECTOR);
  if (list) {
    list.style.maxHeight = "calc(400vh - 96px)";
    list.style.overflowY = "auto";
  }
}
