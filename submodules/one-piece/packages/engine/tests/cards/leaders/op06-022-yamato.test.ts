import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op06Yamato022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-022 Yamato", () => {
  test("deals two Life damage through the public battle flow", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op06Yamato022 },
      { life: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.hand).toHaveLength(2);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the rested-DON count and Character recipient at the Life boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06Yamato022,
        character: [eb01Doma005, eb01Fourtricks025],
        restedDon: 2,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01Doma005] },
    );
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Yamato's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Yamato's Character recipient choice.");
    }
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.characters[0]?.attachedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
