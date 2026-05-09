// CONSTANTS:
const SHEET_SELECTOR = "yt-contextual-sheet-layout";

const HEADER_CONTAINER_SELECTOR = "yt-panel-header-view-model";

const PLAYLIST_LIST_SELECTOR = ".ytListViewModelHost";

const PLAYLIST_ITEM_SELECTOR = ".toggleableListItemViewModelHost";

const PLAYLIST_TITLE_SELECTOR = ".ytAttributedStringHost";

// KEYBINDING:
document.addEventListener("keydown", (e) => {
  if (e.key === "s" && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    openSaveToPlaylist();
  }
});

function openSaveToPlaylist() {
  const btn = document.querySelector('button[aria-label^="Save"]');
  if (btn) {
    btn.click();
    return;
  }

  const moreBtn = document.querySelector('button[aria-label="More actions"]');
  if (moreBtn) {
    moreBtn.click();
    setTimeout(() => {
      const menuItems = document.querySelectorAll("ytd-menu-service-item-renderer yt-formatted-string");
      const saveItem = [...menuItems].find(el => el.textContent.trim().toLowerCase().includes("save"));
      saveItem?.closest("ytd-menu-service-item-renderer")?.click();
    }, 200);
  }
}

// OBSERVER:
const observer = new MutationObserver(() => {
  const sheet = document.querySelector(SHEET_SELECTOR);
  if (!sheet) return;

  const headerContainer = sheet.querySelector(HEADER_CONTAINER_SELECTOR);

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
  const inputWrapper = document.createElement("div");
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
  headerContainer.after(inputWrapper);
  setTimeout(() => searchInput.focus(), 100);

  const getPlaylists = () =>
    Array.from(sheet.querySelectorAll(PLAYLIST_ITEM_SELECTOR));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    getPlaylists().forEach((playlist) => {
      const titleEl = playlist.querySelector(PLAYLIST_TITLE_SELECTOR);

      const name = titleEl?.textContent.trim().toLowerCase() || "";
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
