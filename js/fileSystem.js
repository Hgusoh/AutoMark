// Recursive traversal of the source folder + mirrored output folder creation

const SUPPORTED_EXTENSIONS = ["pdf", "png"];

function getExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

// Recreates (or reuses) the same subfolder path inside the destination folder
async function getOrCreateDestFolder(destRootHandle, folderPath) {
  let folder = destRootHandle;
  for (const name of folderPath) {
    folder = await folder.getDirectoryHandle(name, { create: true });
  }
  return folder;
}

async function processFile(fileHandle, fileName, extension, destRootHandle, folderPath, watermarkText) {
  let writable;

  try {
    const file = await fileHandle.getFile();
    const destFolder = await getOrCreateDestFolder(destRootHandle, folderPath);
    const outputHandle = await destFolder.getFileHandle(fileName, { create: true });
    writable = await outputHandle.createWritable();

    if (extension === "pdf") {
      const outputBytes = await watermarkPdf(await file.arrayBuffer(), watermarkText);
      await writable.write(outputBytes);
    } else {
      const outputBlob = await watermarkPng(file, watermarkText);
      if (!outputBlob) throw new Error("échec de génération du PNG");
      await writable.write(outputBlob);
    }

    await writable.close();
    logMessage("OK : " + fileName);

  } catch (error) {
    if (writable) {
      try { await writable.abort(); } catch (_) { /* ignore */ }
    }
    logMessage("ERREUR sur " + fileName + " : " + error.message);
  }
}

async function processDirectory(sourceDirHandle, destRootHandle, folderPath, watermarkText) {
  for await (const [name, entry] of sourceDirHandle.entries()) {

    if (entry.kind === "directory") {
      await processDirectory(entry, destRootHandle, [...folderPath, name], watermarkText);
      continue;
    }

    const extension = getExtension(name);
    if (!SUPPORTED_EXTENSIONS.includes(extension)) continue;

    await processFile(entry, name, extension, destRootHandle, folderPath, watermarkText);
  }
}
