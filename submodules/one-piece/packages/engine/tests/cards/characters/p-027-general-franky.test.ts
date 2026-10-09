import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { pMorgan026 } from "@tcg/op-cards";
describe("P027 General Franky", () => {
  test("opponent-turn aura uses base3000 even with another named power buff", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST30-001",
      character: ["P-027", "P-006", "P-022"],
    });
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 3000, 6000]);
    e.asSouth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 7000, 9000]);
    e.asNorth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 3000, 6000]);
  });
  test("synthetic named-target consumer recognizes real Franky alternate name", () => {
    // No authored card currently selects literal Franky. This isolated consumer tests the name contract through commands.
    const saved = pMorgan026.effects;
    try {
      pMorgan026.effects = {
        effects: [
          {
            trigger: "onPlay",
            actions: [
              {
                action: "modifyPower",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: 1, upTo: true },
                  filters: [{ filter: "name", value: "Franky" }],
                },
                value: 1000,
                duration: "thisTurn",
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create({
        hand: ["P-026"],
        activeDon: 4,
        character: ["P-027", "ST21-011", "ST02-002"],
      });
      const general = e.findCardInZone("south", "character", "P-027"),
        normal = e.findCardInZone("south", "character", "ST21-011");
      e.asSouth().play("P-026");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("name");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([general, normal]);
      e.asSouth().chooseTargets(general);
      expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    } finally {
      pMorgan026.effects = saved;
    }
  });
});
