import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("OP08-052 Ace public reveal", () => {
  test("reveals matching top Character to both players before optional play", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP08-052"],
      deck: ["OP03-006", "EB01-005", "ST02-012"],
      activeDon: 5,
    });
    const id = e.findCardInZone("south", "deck", "OP03-006");
    e.asSouth().play("OP08-052");
    expect(e.getView("north").logs.some((x) => x.message.includes("reveals Speed Jil"))).toBe(true);
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().choosePlay(id);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === id)).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test.each(["OP08-042", "OP08-043", "OP08-055"])(
    "reveals ineligible%s and can bottom it without playing",
    (card) => {
      const e = OnePieceTestEngine.create({
        hand: ["OP08-052"],
        deck: [card, "ST02-012", "ST02-006"],
        activeDon: 5,
      });
      e.asSouth().play("OP08-052");
      expect(e.getView("north").logs.some((x) => x.message.includes("reveals "))).toBe(true);
      e.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "south");
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-012"]);
    },
  );
  test("declines optional play of eligible revealed Character and leaves it on top", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP08-052"],
      deck: ["OP03-006", "ST02-012", "ST02-006"],
      activeDon: 5,
    });
    e.asSouth().play("OP08-052");
    e.asSouth().chooseNoPlay();
    e.resolveDecision("effectRevealedDeckPosition", { optionId: "top" }, "south");
    expect(e.getView("north").logs.some((x) => x.message.includes("reveals Speed Jil"))).toBe(true);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP03-006"]);
  });
});
