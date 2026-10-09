// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { Texture } from "three";
import { useSceneTextures } from "../../../../../../../packages/simulator-presentation/src/useSceneTextures";
import { loadSceneTexture } from "../../../../../../../packages/simulator-presentation/src/scene-texture";

vi.mock("../../../../../../../packages/simulator-presentation/src/scene-texture", () => ({
  loadSceneTexture: vi.fn(),
}));
afterEach(() => vi.resetAllMocks());
test("deduplicates textures and disposes a face removed from the viewer projection", async () => {
  const face = new Texture();
  const back = new Texture();
  const dispose = vi.spyOn(face, "dispose");
  vi.mocked(loadSceneTexture).mockImplementation(async (url) => (url === "face" ? face : back));
  const { result, rerender, unmount } = renderHook(({ urls }) => useSceneTextures(urls), {
    initialProps: { urls: ["face", "face", "back"] },
  });
  await waitFor(() => expect(result.current.get("face")?.texture).toBe(face));
  expect(loadSceneTexture).toHaveBeenCalledTimes(2);
  rerender({ urls: ["back"] });
  expect(dispose).toHaveBeenCalledOnce();
  expect(result.current.has("face")).toBe(false);
  unmount();
});
test("disposes late face responses after a privacy change and retries failed assets", async () => {
  let finish: (texture: Texture) => void = () => {};
  vi.mocked(loadSceneTexture).mockImplementation((url) =>
    url === "face"
      ? new Promise((resolve) => {
          finish = resolve;
        })
      : Promise.reject(new Error("offline")),
  );
  const { result, rerender, unmount } = renderHook(
    ({ urls, retry }) => useSceneTextures(urls, retry),
    { initialProps: { urls: ["face", "back"], retry: 0 } },
  );
  await waitFor(() => expect(result.current.get("back")?.failed).toBe(true));
  rerender({ urls: ["back"], retry: 0 });
  const late = new Texture();
  const dispose = vi.spyOn(late, "dispose");
  await act(async () => finish(late));
  expect(dispose).toHaveBeenCalledOnce();
  const recovered = new Texture();
  vi.mocked(loadSceneTexture).mockResolvedValue(recovered);
  rerender({ urls: ["back"], retry: 1 });
  await waitFor(() => expect(result.current.get("back")?.texture).toBe(recovered));
  unmount();
});
