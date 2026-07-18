import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Isuka094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-094 Isuka", () => {
  test("reactivates only once after its own battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Isuka094, attachedDon: 1, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const isukaId = engine.findCardInZone("south", "character", op02Isuka094);
    const targets = engine
      .getView("south")
      .players.north.characters.filter((card) => card?.cardId === eb01Doma005.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(isukaId, targets[0]!, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === isukaId)
        ?.rested,
    ).toBe(false);

    engine.declareAttack(isukaId, targets[1]!, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === isukaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.north.trash).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not reactivate after another Character's battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Isuka094, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const isukaId = engine.findCardInZone("south", "character", op02Isuka094);
    const otherAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(isukaId, engine.leader("north"), "south");
    engine.declareAttack(otherAttackerId, targetId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === isukaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
