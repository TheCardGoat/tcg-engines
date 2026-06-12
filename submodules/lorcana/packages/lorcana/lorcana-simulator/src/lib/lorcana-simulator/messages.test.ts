import { describe, expect, it } from "bun:test";
import { m } from "$lib/i18n/messages.js";

describe("paraglide messages proxy fallback", () => {
  it("returns translated strings for known generated keys", () => {
    expect(m["sim.pregame.chooseFirst.button.playerOne"]({})).toBe("Player One goes first");
  });

  it("resolves newly cataloged adapter labels through generated messages", () => {
    expect(m["sim.actions.label.challenge"]({})).toBe("Challenge");
    expect(m["sim.actions.label.activateAbility"]({})).toBe("Activate Ability");
    expect(m["sim.actions.label.moveToLocation"]({})).toBe("Move to Location");
  });

  it("resolves newly cataloged tag labels through generated messages", () => {
    expect(m["sim.card.tags.freshInk.label"]({})).toBe("Fresh Ink");
    expect(m["sim.card.tags.damage.label"]({ count: 3 })).toBe("Damaged 3");
  });

  it("resolves stacked second-layer guidance copy through generated messages", () => {
    expect(m["sim.guidance.secondLayer.chooseCategoryAction"]({ category: "Challenge" })).toBe(
      "Choose a Challenge action.",
    );
  });

  it("falls back to the English catalog when a key is not generated but exists in en.json", () => {
    expect(m["sim.pregame.chooseFirst.button"]({})).toBe("Player One goes first");
  });

  it("returns a bracketed message id fallback when key is not found anywhere", () => {
    expect(m["sim.pregame.chooseFirst.missingKey"]({})).toBe(
      "[sim.pregame.chooseFirst.missingKey]",
    );
  });

  it("does not throw when invoking fallback handlers", () => {
    expect(() => {
      m["sim.pregame.chooseFirst.missingKey"]();
    }).not.toThrow();
  });
});
