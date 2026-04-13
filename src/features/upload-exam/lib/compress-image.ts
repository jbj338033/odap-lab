export async function compressImage(
  file: File,
  maxWidth = 1600,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(
    bitmap.width * scale,
    bitmap.height * scale,
  );
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
}
