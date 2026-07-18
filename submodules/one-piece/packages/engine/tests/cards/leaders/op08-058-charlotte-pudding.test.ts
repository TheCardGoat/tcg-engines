import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08CharlottePudding058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP08-058 Charlotte Pudding", () => {
  test("turns the top two Life face-up and adds the chosen rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08CharlottePudding058,
        life: [eb01Doma005, eb01MountainGod018],
        donDeckCount: 1,
      },
      {},
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const lifeIds = [...engine.getState().players.south.life];

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Pudding's DON!! count choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(lifeIds.every((instanceId) => engine.getState().cards[instanceId]?.faceUp)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
