import { Texture } from "three";

/** Explicit recovery of a failed public asset, retaining its canonical CDN URL. */
export async function loadSceneTexture(url: string, signal: AbortSignal): Promise<Texture> {
  const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "reload", signal });
  if (!response.ok) throw new Error(`Asset request failed (${response.status})`);
  const blob = await response.blob();
  signal.throwIfAborted();
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();
  let revoked = false;
  const revoke = () => {
    if (revoked) return;
    revoked = true;
    URL.revokeObjectURL(objectUrl);
  };
  const abort = () => {
    image.src = "";
    revoke();
  };
  signal.addEventListener("abort", abort, { once: true });
  try {
    image.src = objectUrl;
    await image.decode();
    signal.throwIfAborted();
    const texture = new Texture(image);
    texture.needsUpdate = true;
    return texture;
  } finally {
    signal.removeEventListener("abort", abort);
    revoke();
  }
}
