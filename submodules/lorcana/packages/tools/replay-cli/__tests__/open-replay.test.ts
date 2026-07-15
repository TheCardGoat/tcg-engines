import { describe, it, expect } from "bun:test";
import { buildReplayUrl, getOpenCommand } from "../src/open-replay";

describe("buildReplayUrl", () => {
  it("builds a watcher URL against the localhost default", () => {
    const url = buildReplayUrl({
      baseUrl: "http://localhost:5173",
      replayId: "game-abc",
      step: 12,
      mode: "watch",
    });
    expect(url).toBe("http://localhost:5173/replay/game-abc?step=12");
  });

  it("builds a watcher URL against a production base", () => {
    const url = buildReplayUrl({
      baseUrl: "https://tcg.online",
      replayId: "game-abc",
      step: 0,
      mode: "watch",
    });
    expect(url).toBe("https://tcg.online/replay/game-abc?step=0");
  });

  it("strips trailing slashes from the base URL", () => {
    const url = buildReplayUrl({
      baseUrl: "https://tcg.online//",
      replayId: "game-abc",
      step: 4,
      mode: "watch",
    });
    expect(url).toBe("https://tcg.online/replay/game-abc?step=4");
  });

  it("encodes the replay id so weird characters are safe in the path", () => {
    const url = buildReplayUrl({
      baseUrl: "http://localhost:5173",
      replayId: "game/with spaces&amp",
      step: 1,
      mode: "watch",
    });
    expect(url).toBe("http://localhost:5173/replay/game%2Fwith%20spaces%26amp?step=1");
  });

  it("builds a fork URL with the requested side", () => {
    const url = buildReplayUrl({
      baseUrl: "http://localhost:5173",
      replayId: "game-abc",
      step: 7,
      mode: "fork",
      side: "playerTwo",
    });
    expect(url).toBe("http://localhost:5173/replay/game-abc/fork?step=7&side=playerTwo");
  });

  it("throws when fork mode is requested without a side", () => {
    expect(() =>
      buildReplayUrl({
        baseUrl: "http://localhost:5173",
        replayId: "game-abc",
        step: 0,
        mode: "fork",
      }),
    ).toThrow(/fork mode requires a side/);
  });
});

describe("getOpenCommand", () => {
  it("uses `open` on macOS", () => {
    expect(getOpenCommand("darwin", "http://x")).toEqual({
      command: "open",
      args: ["http://x"],
    });
  });

  it("uses `cmd /c start` on Windows so the URL is passed as the title-skipped arg", () => {
    // The empty-string second arg is intentional: `start` treats its first
    // quoted arg as a window title, so we pass "" then the URL.
    expect(getOpenCommand("win32", "http://x")).toEqual({
      command: "cmd",
      args: ["/c", "start", "", "http://x"],
    });
  });

  it("falls back to `xdg-open` on Linux and other platforms", () => {
    expect(getOpenCommand("linux", "http://x")).toEqual({
      command: "xdg-open",
      args: ["http://x"],
    });
    expect(getOpenCommand("freebsd" as NodeJS.Platform, "http://x")).toEqual({
      command: "xdg-open",
      args: ["http://x"],
    });
  });
});
