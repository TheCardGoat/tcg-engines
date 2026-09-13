import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06RoronoaZoro118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-118 Roronoa Zoro", () => {
  test("pays each separate once-per-turn DON!! cost to set itself active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06RoronoaZoro118, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { life: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zoroId = engine.findCardInZone("south", "character", op06RoronoaZoro118);

    engine.declareAttack(zoroId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 1 });

    engine.declareAttack(zoroId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.rested,
    ).toBe(true);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    engine.activateEffect(zoroId, "activateMain", "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: zoroId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06RoronoaZoro118, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { life: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zoroId = engine.findCardInZone("south", "character", op06RoronoaZoro118);
    engine.declareAttack(zoroId, engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
