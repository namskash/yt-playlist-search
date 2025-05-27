const observer = new MutationObserver(() => {
  const popupContainer = document.querySelector("ytd-add-to-playlist-renderer");
  const playlistSearchBox = document.querySelector("#playlist-search-box");

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
    document.querySelectorAll("ytd-playlist-add-to-option-renderer"),
  );

  searchInputBox.addEventListener("input", (e) => {
    const filterString = searchInputBox.value.toLowerCase();

    playlists.forEach((playlist) => {
      const playlistLabel = playlist.querySelector("yt-formatted-string#label");

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
