import { afterEach, expect, test, vi } from "vite-plus/test";
import { Texture, TextureLoader } from "three";
import { BoardTextureLoader } from "./BoardTextureLoader";
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
test("revalidates a cached non-CORS image once without weakening CORS", async () => {
  const texture = new Texture();
  vi.spyOn(TextureLoader.prototype, "load").mockImplementation((_url, _load, _progress, error) => {
    queueMicrotask(() => error?.(new Error("cached image has no CORS header")));
    return texture;
  });
  const blob = new Blob(["image"]);
  const fetch = vi.fn().mockResolvedValue({ ok: true, blob: () => Promise.resolve(blob) });
  const bitmap = { width: 100, height: 140 };
  vi.stubGlobal("fetch", fetch);
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
  const loaded = await new Promise<Texture>((resolve, reject) =>
    new BoardTextureLoader().load(
      "https://cdn.tcg.online/public/card.webp",
      resolve,
      undefined,
      reject,
    ),
  );
  expect(fetch).toHaveBeenCalledExactlyOnceWith("https://cdn.tcg.online/public/card.webp", {
    mode: "cors",
    credentials: "omit",
    cache: "reload",
  });
  expect(loaded).toBe(texture);
  expect(loaded.image).toBe(bitmap);
  expect(loaded.flipY).toBe(false);
});
test("reports an unavailable asset after one revalidation attempt", async () => {
  vi.spyOn(TextureLoader.prototype, "load").mockImplementation((_url, _load, _progress, error) => {
    queueMicrotask(() => error?.(new Error("image unavailable")));
    return new Texture();
  });
  const fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
  vi.stubGlobal("fetch", fetch);
  await expect(
    new Promise<Texture>((resolve, reject) =>
      new BoardTextureLoader().load("missing.webp", resolve, undefined, reject),
    ),
  ).rejects.toThrow("HTTP 404");
  expect(fetch).toHaveBeenCalledTimes(1);
});
