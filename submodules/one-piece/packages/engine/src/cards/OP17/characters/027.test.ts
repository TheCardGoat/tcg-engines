import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-027 Benn.Beckman", () => {
  test("[Rush: Character] lets it attack a rested Character on the turn it is played; [On Play] draws and rests with a Red-Haired Leader", () => {
    let engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-020",
        hand: ["OP17-027"],
        activeDon: 9,
        deck: ["ST02-002", "ST02-006"],
      },
      { character: ["OP13-013", "OP16-012"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const bennId = engine.findCardInZone("north", "character", "OP16-012");
    const handBefore = engine.getView("south").players.south.handCount;
    const drawn = engine.findCardInZone("south", "deck", "ST02-002");

    engine.playCard("OP17-027");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest targets.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId, bennId] }, "south");

    const north = () => engine.getView("south").players.north;
    // Both active Characters become rested, and the physical top card is drawn.
    expect(north().characters.find((c) => c?.instanceId === bennId)?.rested).toBe(true);
    expect(north().characters.find((c) => c?.instanceId === higumaId)?.rested).toBe(true);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual([
      drawn,
    ]);
    expect(engine.getView("south").players.south.handCount).toBe(handBefore - 1 + 1);

    const source = engine.findCardInZone("south", "character", "OP17-027");
    const failed = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: source,
      targetId: engine.asNorth().leader(),
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === source)
        ?.rested,
    ).toBe(false);
    engine.asSouth().attack("OP17-027", "OP13-013");
    expect(north().trash.map((c) => c.instanceId)).toContain(higumaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("a different green Leader neither draws nor rests either eligible opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        hand: ["OP17-027"],
        activeDon: 7,
        deck: ["ST02-002", "ST02-006"],
      },
      { leaderCardId: "ST01-001", character: ["ST01-003", "ST01-005"] },
    );
    engine.asSouth().play("OP17-027");
    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.north.characters.filter(Boolean).map((card) => card?.rested)).toEqual([
      false,
      false,
    ]);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a printed Counter cannot stop a Leader attack from hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-027"], life: 3 },
      {},
      { activeSeat: "north" },
    );
    const benn = engine.findCardInZone("south", "hand", "OP17-027");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(benn);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
