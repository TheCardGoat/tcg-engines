import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Sanji014,
  eb02ThreePaceHumSoulNotchSlash051,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-051 Three-Pace Hum Soul Notch Slash", () => {
  test("chooses the K.O. branch and limits its opposing target to cost 2 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02ThreePaceHumSoulNotchSlash051],
        activeDon: 3,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb02ThreePaceHumSoulNotchSlash051);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02ThreePaceHumSoulNotchSlash051);

    const choiceDecision = engine.pendingDecision("effectActionChoice", "south");
    expect(choiceDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the K.O. branch to publish its opposing Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("chooses the cost branch, applies −4 for this turn, and expires it at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02ThreePaceHumSoulNotchSlash051],
        activeDon: 3,
      },
      {
        character: [eb01Sanji014, eb01Fourtricks025],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Sanji014);
    const unselectedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02ThreePaceHumSoulNotchSlash051);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the cost branch to publish its opposing Character choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let northCharacters = engine.getView("south").players.north.characters;
    expect(northCharacters.find((card) => card?.instanceId === selectedId)?.cost).toBe(0);
    expect(northCharacters.find((card) => card?.instanceId === unselectedId)?.cost).toBe(3);

    engine.endTurn("south");
    northCharacters = engine.getView("south").players.north.characters;
    expect(northCharacters.find((card) => card?.instanceId === selectedId)?.cost).toBe(4);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
