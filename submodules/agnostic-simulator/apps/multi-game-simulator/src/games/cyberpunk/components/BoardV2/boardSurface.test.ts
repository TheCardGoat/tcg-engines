// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import {
  BOARD_SURFACE_STORAGE_KEY,
  CYBERPUNK_BOARD_SURFACES,
  boardSurfaceTextureUrl,
  preloadBoardSurface,
  resolveBoardSurface,
  setBoardSurface,
  useBoardSurfaceId,
} from "./boardSurface";

beforeEach(() => {
  localStorage.removeItem(BOARD_SURFACE_STORAGE_KEY);
  setBoardSurface("default");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("missing, unknown and retired selections resolve to the bundled default", () => {
  for (const selection of [null, undefined, "", "default", "retired-preset"]) {
    expect(resolveBoardSurface(selection)).toBe(CYBERPUNK_BOARD_SURFACES.default);
    expect(boardSurfaceTextureUrl(resolveBoardSurface(selection))).toContain(
      "surface-weathered-v2",
    );
  }
});

test("every published preset resolves to its board-v2 CDN revision", () => {
  expect(Object.keys(CYBERPUNK_BOARD_SURFACES)).toEqual([
    "default",
    "plates",
    "tech-mat",
    "street",
  ]);
  for (const surface of Object.values(CYBERPUNK_BOARD_SURFACES)) {
    expect(resolveBoardSurface(surface.id)).toBe(surface);
    if (surface.src) {
      expect(surface.src).toMatch(
        /^https:\/\/cdn\.tcg\.online\/public\/cyberpunk\/simulator\/ui\/board-v2\/v1\/surface-\w+\.webp$/,
      );
      expect(boardSurfaceTextureUrl(surface)).toBe(surface.src);
    }
  }
});

test("setBoardSurface persists, notifies hook subscribers and ignores no-ops", () => {
  const { result } = renderHook(() => useBoardSurfaceId());
  expect(result.current).toBe("default");
  act(() => setBoardSurface("street"));
  expect(result.current).toBe("street");
  expect(localStorage.getItem(BOARD_SURFACE_STORAGE_KEY)).toBe("street");
  act(() => setBoardSurface("street"));
  expect(result.current).toBe("street");
});

test("a stored id that no longer matches a preset falls back to the default", () => {
  localStorage.setItem(BOARD_SURFACE_STORAGE_KEY, "ancient-surface");
  expect(resolveBoardSurface(localStorage.getItem(BOARD_SURFACE_STORAGE_KEY))).toBe(
    CYBERPUNK_BOARD_SURFACES.default,
  );
});

test("blocked storage still switches the surface for this session", () => {
  const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota blocked");
  });
  expect(() => setBoardSurface("plates")).not.toThrow();
  expect(setItem).toHaveBeenCalledWith(BOARD_SURFACE_STORAGE_KEY, "plates");
  setItem.mockRestore();
  setBoardSurface("street");
  expect(localStorage.getItem(BOARD_SURFACE_STORAGE_KEY)).toBe("street");
});

test("preloadBoardSurface resolves for the default and warms an anonymous-CORS image", async () => {
  await expect(preloadBoardSurface(CYBERPUNK_BOARD_SURFACES.default)).resolves.toBeUndefined();

  let loaded: (() => void) | null = null;
  class FakeImage {
    crossOrigin = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(value: string) {
      expect(value).toBe(CYBERPUNK_BOARD_SURFACES.plates.src);
      expect(this.crossOrigin).toBe("anonymous");
      loaded = this.onload;
      queueMicrotask(() => loaded?.());
    }
  }
  vi.stubGlobal("Image", FakeImage);
  await expect(preloadBoardSurface(CYBERPUNK_BOARD_SURFACES.plates)).resolves.toBeUndefined();
});

test("preloadBoardSurface rejects when the CDN image fails", async () => {
  class FailingImage {
    crossOrigin = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_value: string) {
      queueMicrotask(() => this.onerror?.());
    }
  }
  vi.stubGlobal("Image", FailingImage);
  await expect(preloadBoardSurface(CYBERPUNK_BOARD_SURFACES.street)).rejects.toThrow(
    "Board surface failed to load",
  );
});
