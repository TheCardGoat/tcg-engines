import { renderHook, cleanup } from "@testing-library/react";
import { afterEach } from "vite-plus/test";
import { describe, expect, it } from "vite-plus/test";
import { liveMatchDocumentTitle, useLiveMatchDocumentTitle } from "./useLiveMatchDocumentTitle";

afterEach(cleanup);

describe("live match tab title", () => {
  it("separates turn ownership from priority", () => {
    expect(liveMatchDocumentTitle({ game: "Cyberpunk", turn: "self", priority: "opponent" })).toBe(
      "⏳ Your turn · Cyberpunk",
    );
    expect(liveMatchDocumentTitle({ game: "Gundam", turn: "opponent", priority: "self" })).toBe(
      "⚡ Opponent turn · Gundam",
    );
  });

  it("does not invent priority when a game has no priority signal", () => {
    expect(liveMatchDocumentTitle({ game: "Riftbound", turn: null, priority: null })).toBe(
      "🎮 Riftbound",
    );
    expect(liveMatchDocumentTitle({ game: "Alpha Clash", turn: "opponent", priority: null })).toBe(
      "⏳ Opponent turn · Alpha Clash",
    );
  });

  it("shows terminal status before stale turn state", () => {
    expect(
      liveMatchDocumentTitle({
        game: "Flesh and Blood",
        turn: "self",
        priority: "self",
        finished: true,
      }),
    ).toBe("🏁 Flesh and Blood");
  });

  it("updates the browser title when turn and priority change", () => {
    const { rerender } = renderHook((state) => useLiveMatchDocumentTitle(state), {
      initialProps: {
        game: "Cyberpunk",
        turn: "self" as const,
        priority: "self" as "self" | "opponent",
      },
    });
    expect(document.title).toBe("⚡ Your turn · Cyberpunk");
    rerender({ game: "Cyberpunk", turn: "self", priority: "opponent" });
    expect(document.title).toBe("⏳ Your turn · Cyberpunk");
  });
});
