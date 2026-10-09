import { describe, expect, it } from "vitest";
import { alphaClashOpening as alpha } from "../../games/alpha-clash/opening-fixture";
import { grandArchiveOpening as archive } from "../../games/grand-archive/opening-fixture";
import { openingCardIndex, openingLayout } from "@tcg/simulator-presentation/opening";

describe("opening visual contracts", () => {
  it("Alpha Clash keeps eight cards and returns only selected slots before replacing them", () => {
    const [returning, shuffle, redraw, settle, play] = alpha.afterHand(true, 2);
    const layout = openingLayout(1280, 650, 8);
    expect(layout.card(2, false, returning!, true)).toEqual(layout.deck(false));
    expect(layout.card(3, false, returning!, false)).not.toEqual(layout.deck(false));
    expect(shuffle?.hand).toBe("return");
    expect(redraw).toMatchObject({ localCount: 8, replacement: true });
    expect(settle?.hand).toBe("table");
    expect(play?.action).toBeUndefined();
    expect(openingCardIndex(3, [2, 5], true, 8, 11)).toBe(3);
    expect(openingCardIndex(2, [2, 5], true, 8, 11)).toBe(8);
    expect(openingCardIndex(5, [2, 5], true, 8, 11)).toBe(9);
  });
  it("keep hand never adds a return, shuffle, or second mulligan", () => {
    expect(alpha.afterHand(false, 0).map((beat) => beat.id)).toEqual(["settle", "play"]);
    expect(alpha.afterHand(false, 0).at(-1)?.detail).toContain("Opponent may");
  });
  it.each([true, false])(
    "Grand Archive reveals both Spirits before resolving draws in order: first=%s",
    (first) => {
      const beats = archive.afterOrder(first);
      expect(archive.canMulligan).toBe(false);
      expect(archive.orderChoice).toBe(false);
      expect(beats[1]).toMatchObject({ leaders: "showcase", localCount: 0, rivalCount: 0 });
      expect(beats.find((beat) => beat.id === "draw-first")).toMatchObject({
        localCount: first ? 7 : 0,
        rivalCount: first ? 0 : 7,
      });
      expect(beats.find((beat) => beat.id === "draw-second")).toMatchObject({
        localCount: 7,
        rivalCount: 7,
      });
      expect(archive.afterHand(first, 0).at(-1)?.title).toBe("Main phase");
    },
  );
  it.each([390, 768, 1280, 1920])("keeps review cards inside the viewport at %s px", (width) => {
    for (const fixture of [alpha, archive]) {
      const beat = fixture.afterOrder(true).at(-1)!;
      const layout = openingLayout(width, 650, fixture.handSize);
      for (let slot = 0; slot < fixture.handSize; slot++) {
        const pose = layout.card(slot, false, beat, false);
        expect(pose.left).toBeGreaterThan(0);
        expect(pose.left + pose.width).toBeLessThan(width);
        expect(pose.top).toBeGreaterThan(0);
        expect(pose.top + pose.height).toBeLessThan(650);
        expect(pose.width / pose.height).toBeCloseTo(5 / 7);
      }
    }
  });
});
