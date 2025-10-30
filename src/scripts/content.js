const observer = new MutationObserver(() => {
  const popupContainer = document.querySelector("yt-contextual-sheet-layout");
  if (!popupContainer) return; // still not visible

  let playlistSearchBox = popupContainer.querySelector('#playlist-search-box');

  if (popupContainer && !playlistSearchBox) {
    insertPLaylistSearchBox(popupContainer);
  }
  // Bring to focus
  if (playlistSearchBox) {
    requestAnimationFrame(() => {
      playlistSearchBox.focus();
      observer.disconnect();
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

function insertPLaylistSearchBox(popupContainer) {
  const searchInputBox = document.createElement("input");
  searchInputBox.id = "playlist-search-box";

  searchInputBox.placeholder = "Search Playlists...";
  searchInputBox.className = "ytd-playlist-search-input";

  const playlists = Array.from(
    popupContainer.querySelectorAll(".yt-list-item-view-model"),
  );

  searchInputBox.addEventListener("input", (e) => {
    const filterString = searchInputBox.value.toLowerCase();

    playlists.forEach((playlist) => {
      const playlistLabel = playlist.querySelector(".yt-list-item-view-model__title");

      const playlistName = playlistLabel.innerText.toLowerCase();
      playlist.style.display = playlistName.includes(filterString)
        ? "block"
        : "none";
    });
  });

  const inputContainer = document.createElement("div");
  inputContainer.className = "ytd-playlist-search-input-container";

  inputContainer.appendChild(searchInputBox);
  popupContainer.prepend(inputContainer);
}
