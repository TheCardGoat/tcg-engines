import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-042-roronoa-zoro", () => {
  test("actual Life Trigger KOs opposing cost4 and excludes cost5", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-042", "P-012", "P-015", "P-016"] },
      { character: ["P-033", "P-032"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-033"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-033"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("P-033");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-042");
  });
  test("declines optional Trigger KO target", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-042", "P-012", "P-015", "P-016"] },
      { character: ["P-033"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-033");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
