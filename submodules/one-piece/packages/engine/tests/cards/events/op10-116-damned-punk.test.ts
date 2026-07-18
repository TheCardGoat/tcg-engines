import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10DamnedPunk116,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-116 Damned Punk", () => {
  test("Main privately looks at either top Life, repositions it, then independently K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10DamnedPunk116], activeDon: 4 },
      { life: [eb01Doma005, eb01Fourtricks025], character: [eb01MountainGod018] },
    );
    const lookedId = engine.findCardInZone("north", "life", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op10DamnedPunk116);
    const ownerDecision = engine.pendingDecision("effectLookAtLifeOwner", "south");
    const ownerStep = ownerDecision.steps[0];
    expect(ownerStep?.kind).toBe("chooseOption");
    if (ownerStep?.kind !== "chooseOption") throw new Error("Expected a Life owner choice.");
    expect(ownerStep.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");

    const positionDecision = engine.pendingDecision("effectLookAtLifePosition", "south");
    const positionStep = positionDecision.steps[0];
    expect(positionStep?.kind).toBe("chooseOption");
    if (positionStep?.kind !== "chooseOption") throw new Error("Expected a Life position choice.");
    expect(positionDecision.message).toContain(eb01Doma005.name);
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Doma005.name);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(lookedId);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws two before requiring one card to be trashed", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op10DamnedPunk116],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const trashId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand).toHaveLength(2);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [trashId] }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
