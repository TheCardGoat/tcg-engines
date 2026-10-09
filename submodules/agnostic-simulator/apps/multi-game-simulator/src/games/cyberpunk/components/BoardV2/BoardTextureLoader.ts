import { Texture, TextureLoader } from "three";

/**
 * V1 can leave a non-CORS image response in the browser's immutable cache.
 * WebGL needs an anonymous CORS response, even for that same public image.
 * Revalidate once after an image error; keep CORS enforced and propagate failure.
 */
export class BoardTextureLoader extends TextureLoader {
  override load(
    url: string,
    onLoad?: (texture: Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ): Texture {
    const texture = super.load(url, onLoad, onProgress, () => {
      fetch(url, { mode: "cors", credentials: "omit", cache: "reload" })
        .then((response) => {
          if (!response.ok) throw new Error(`Card artwork returned HTTP ${response.status}`);
          return response.blob();
        })
        .then((blob) => createImageBitmap(blob, { imageOrientation: "flipY" }))
        .then((bitmap) => {
          texture.image = bitmap;
          texture.flipY = false;
          texture.needsUpdate = true;
          onLoad?.(texture);
        })
        .catch((error: unknown) => onError?.(error));
    });
    return texture;
  }
}
