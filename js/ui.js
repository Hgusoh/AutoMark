// Handles all direct DOM updates (log panel + folder selection cards)

const logOutput = document.getElementById("logOutput");

function logMessage(message) {
  logOutput.textContent += message + "\n";
}

function clearLog() {
  logOutput.textContent = "";
}

// Marks a folder card as "selected" (green, filled icon, bold name)
function markFolderSelected(itemId, nameId, folderName) {
  const item = document.getElementById(itemId);
  const nameEl = document.getElementById(nameId);

  item.classList.add("list-group-item-success");
  item.querySelector("i").className = "bi bi-folder-fill text-success me-2 fs-5";
  nameEl.innerHTML = `<span class="fw-bold">${folderName}</span>`;
}
