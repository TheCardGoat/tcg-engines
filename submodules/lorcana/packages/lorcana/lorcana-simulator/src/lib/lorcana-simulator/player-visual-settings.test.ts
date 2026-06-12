import { describe, expect, it } from "bun:test";

import {
  getLorcanaPlayerVisualSettings,
  resolveLorcanaCardBack,
  resolveLorcanaPlaymat,
} from "@/features/simulator/model/player-visual-settings.js";

describe("player visual settings resolution", () => {
  it("returns defaults when the map is missing or owner id is unknown", () => {
    expect(getLorcanaPlayerVisualSettings(undefined, "missing")).toMatchObject({
      cardBack: {
        id: "default",
      },
      playmat: {
        id: "default",
        src: null,
      },
    });

    expect(getLorcanaPlayerVisualSettings({}, null)).toMatchObject({
      cardBack: {
        id: "default",
      },
      playmat: {
        id: "default",
        src: null,
      },
    });
  });

  it("resolves preset card backs and playmats by owner id", () => {
    const resolved = getLorcanaPlayerVisualSettings(
      {
        alice: { cardBack: "white", playmat: "elsa" },
      },
      "alice",
    );

    expect(resolved.cardBack).toEqual({
      id: "white",
      src: "https://new-cdn.lorcanito.com/public/lorcana/simulator/card-back/back-white.webp",
      artOnlySrc:
        "https://new-cdn.lorcanito.com/public/lorcana/simulator/card-back/back-white-square.webp",
    });
    expect(resolved.playmat).toEqual({
      id: "elsa",
      src: "https://new-cdn.lorcanito.com/public/lorcana/simulator/playmats/elsa_bg.webp",
    });
  });

  it("accepts direct URLs for card backs and playmats", () => {
    expect(resolveLorcanaCardBack("https://example.com/back.webp")).toEqual({
      id: "https://example.com/back.webp",
      src: "https://example.com/back.webp",
      artOnlySrc: "https://example.com/back.webp",
    });
    expect(resolveLorcanaPlaymat("https://example.com/mat.webp")).toEqual({
      id: "https://example.com/mat.webp",
      src: "https://example.com/mat.webp",
    });
  });
});
