// Watermarking logic for PDF (pdf-lib) and PNG (canvas) 

async function watermarkPdf(fileBytes, text) {
  const pdfDoc = await PDFLib.PDFDocument.load(fileBytes);
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();

    // Taille de police proportionnelle à la largeur de la page
    const fontSize = Math.round(width / 15);
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    // Espacement entre chaque répétition du filigrane
    const spacingX = textWidth + fontSize * 3;
    const spacingY = fontSize * 5;

    // On répète le filigrane sur toute la page, en grille
    for (let y = 0; y < height + spacingY; y += spacingY) {
      for (let x = 30; x < width + spacingX; x += spacingX) {
        page.drawText(text, {
          x: x,
          y: y,
          size: fontSize,
          font: font,
          color: PDFLib.rgb(0.6, 0.6, 0.6),
          opacity: 0.3,
          rotate: PDFLib.degrees(30),
        });
      }
    }
  }

  return pdfDoc.save();
}

async function watermarkPng(file, text) {
  const image = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  // Taille de police proportionnelle à la largeur de l'image
  const fontSize = Math.round(canvas.width / 15);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "gray";
  ctx.globalAlpha = 0.3;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Espacement entre chaque répétition du filigrane
  const textWidth = ctx.measureText(text).width;
  const spacingX = textWidth + fontSize * 2;
  const spacingY = fontSize * 4;

  // On répète le filigrane sur toute l'image, en grille (x et y)
  for (let y = 0; y < canvas.height + spacingY; y += spacingY) {
    for (let x = 0; x < canvas.width + spacingX; x += spacingX) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
