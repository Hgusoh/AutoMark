// Entry point: wires up UI events and orchestrates the watermarking process

let sourceDirHandle = null;
let destDirHandle = null;

async function pickSourceFolder() {
  sourceDirHandle = await window.showDirectoryPicker();
  markFolderSelected("sourceItem", "sourceName", sourceDirHandle.name);
}

async function pickDestFolder() {
  destDirHandle = await window.showDirectoryPicker();
  markFolderSelected("destItem", "destName", destDirHandle.name);
}

async function runWatermarking() {
  if (!sourceDirHandle || !destDirHandle) {
    alert("Choisis d'abord les deux dossiers.");
    return;
  }

  clearLog();
  const watermarkText = document.getElementById("watermarkTextInput").value || "CONFIDENTIEL";

  logMessage("Démarrage...");
  await processDirectory(sourceDirHandle, destDirHandle, [], watermarkText);
  logMessage("Terminé.");
}

document.getElementById("pickSourceBtn").addEventListener("click", pickSourceFolder);
document.getElementById("pickDestBtn").addEventListener("click", pickDestFolder);
document.getElementById("runBtn").addEventListener("click", runWatermarking);
