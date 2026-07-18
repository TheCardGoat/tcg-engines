import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op03TropicalTorment120,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-120 Tropical Torment", () => {
  test("at the four-Life boundary, maps the optional opposing top-Life trash count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03TropicalTorment120],
        activeDon: 3,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Hajrudin018],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op03TropicalTorment120);
    const topLifeId = engine.getState().players.north.life[0]!;

    engine.playCard(op03TropicalTorment120);

    const lifeDecision = engine.pendingDecision("effectRemoveFromLifeCount", "south");
    const lifeStep = lifeDecision.steps[0];
    expect(lifeStep?.kind).toBe("chooseOption");
    if (lifeStep?.kind !== "chooseOption") {
      throw new Error("Expected the controller to choose the optional opposing Life count.");
    }
    expect(lifeStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(3);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(topLifeId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without payment and routes the opponent's top Life to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Hajrudin018],
      },
      {
        life: [op03TropicalTorment120],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const topLifeId = engine.getState().players.south.life[0]!;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const lifeDecision = engine.pendingDecision("effectRemoveFromLifeCount", "north");
    expect(lifeDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      topLifeId,
    );
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
