import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st24-005-x-drake", () => {
  test("Supernovas Leader rests cost5 or less and schedules DON for turn end", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", hand: ["ST24-005"], activeDon: 5 },
      { character: ["ST21-005", "ST15-002"] },
    );
    e.playCard("ST24-005");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-005"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("south").players.south.activeDon).toBe(0);
    e.asSouth().endTurn();
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("declines optional rest and delayed ready independently", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", hand: ["ST24-005"], activeDon: 5 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST24-005");
    e.asSouth().chooseNoTargets();
    e.asSouth().endTurn();
    e.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
  test("wrong Leader does not rest or schedule DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST05-001", hand: ["ST24-005"], activeDon: 5 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST24-005");
    expect(e.getView("south").prompts).toHaveLength(0);
    e.asSouth().endTurn();
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("scheduled DON ready survives returning Drake to hand", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        hand: ["ST24-005"],
        character: [{ cardId: "ST22-005", rested: true }],
        activeDon: 8,
      },
      { character: ["ST21-005"] },
    );
    e.playCard("ST24-005");
    e.asSouth().chooseNoTargets();
    e.activateEffect(e.findCardInZone("south", "character", "ST22-005"), "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST24-005");
    e.asSouth().endTurn();
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST24-005");
  });
});
