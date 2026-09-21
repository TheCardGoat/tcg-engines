import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Krieg008 } from "../../../../../cards/src/cards/characters/op15-008-krieg.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-008 Krieg", () => {
  function setup() {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Krieg008], activeDon: 8 },
      { character: [eb01Doma005, eb01Fourtricks025], restedDon: 4 },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const fourtricksId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    return {
      engine,
      domaId,
      fourtricksId,
      kriegId: () => engine.findCardInZone("south", "character", op15Krieg008),
    };
  }

  function resolveOnPlayGive(engine: OnePieceTestEngine, domaId: string) {
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the rested DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2", "3"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the DON!! recipient.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");
  }

  test("[On Play] moves opponent rested DON!! onto one opponent Character and grants Rush", () => {
    const { engine, kriegId, domaId } = setup();

    engine.playCard(op15Krieg008);
    resolveOnPlayGive(engine, domaId);

    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(1);
    expect(north.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);

    // Rush lets the just-played Character attack immediately.
    engine.declareAttack(kriegId(), engine.leader("north"), "south");
  });

  test("[Activate: Main] gives every opposing Character -1000 power per DON!! on the recipient", () => {
    const { engine, kriegId, domaId, fourtricksId } = setup();

    engine.playCard(op15Krieg008);
    resolveOnPlayGive(engine, domaId);

    engine.activateEffect(kriegId(), "activateMain", "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === domaId)?.power).toBe(0);
    expect(north.characters.find((card) => card?.instanceId === fourtricksId)?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);

    const stillLegal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === kriegId(),
    );
    expect(stillLegal).toBe(false);
  });

  test("cannot activate on a later turn after the play-turn window", () => {
    const { engine, kriegId, domaId } = setup();

    engine.playCard(op15Krieg008);
    resolveOnPlayGive(engine, domaId);
    engine.endTurn("south");
    engine.endTurn("north");

    const legal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === kriegId(),
    );
    expect(legal).toBe(false);
  });
});
