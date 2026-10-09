import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-106-monkey-d-luffy", () => {
  test("Endturn flips only top Life and readies Egghead", () => {
    const e = OnePieceTestEngine.create({
      character: [
        { cardId: "P-106", rested: true },
        { cardId: "P-015", rested: true },
      ],
      life: ["P-012", "P-016"],
    });
    e.asSouth().endTurn();
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("ready");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "character", "P-106"),
    ]);
    e.asSouth().chooseTargets("P-106");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.south.life[0]?.cardId).toBe("P-012");
    expect(e.getView("north").players.south.life[1]?.cardId).toBe(null);
  });
  test("declines optional faceup payment", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "P-106", rested: true }],
      life: 2,
    });
    e.asSouth().endTurn();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.south.life[0]?.cardId).toBe(null);
  });
  test("Life Trigger draws and KOs cost2 excluding3", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-106", "P-012", "P-015", "P-016"] },
      { character: ["P-018", "P-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-018"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-018"));
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("P-018");
  });
  test("already face-up top cannot pay even with face-down bottom", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "P-106", rested: true }],
      life: [{ cardId: "P-012", faceUp: true }, "P-016"],
    });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.south.life[1]?.cardId).toBe(null);
  });
  test("declines Trigger KO after mandatory draw", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-106", "P-012", "P-015", "P-016"] },
      { character: ["P-018"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-018");
  });
});
