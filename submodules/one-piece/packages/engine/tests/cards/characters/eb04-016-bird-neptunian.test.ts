import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op11ScaledNeptunian026,
  op13LordOfTheCoast010,
  op14eb04BirdNeptunian016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-016 Bird Neptunian", () => {
  test("sets one DON!! active, then blocks later Character effects from doing so this turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04BirdNeptunian016, op14eb04BirdNeptunian016],
      restedDon: 2,
    });
    const [firstId, secondId] = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op14eb04BirdNeptunian016.id)
      .map((card) => card!.instanceId);

    engine.activateEffect(firstId!, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    engine.activateEffect(secondId!, "activateMain", "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("with three exact or compound Neptunians, rests an eligible opposing Character when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04BirdNeptunian016, playedOnTurn: 0 },
          op11ScaledNeptunian026,
          op13LordOfTheCoast010,
        ],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const birdId = engine.findCardInZone("south", "character", op14eb04BirdNeptunian016);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(birdId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Bird Neptunian's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
  });
});
