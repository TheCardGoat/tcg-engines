import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Enel052,
  op01DemonFace056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-056 Demon Face", () => {
  test("lets the controller K.O. up to 2 rested cost-5-or-less opposing Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01DemonFace056],
        activeDon: 6,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
          { card: eb01Fourtricks025, rested: false },
          { card: eb02Enel052, rested: true },
        ],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op01DemonFace056);
    const firstSelectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondSelectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeExcludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costlyExcludedId = engine.findCardInZone("north", "character", eb02Enel052);

    engine.playCard(op01DemonFace056);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the opposing Character K.O. choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 2 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstSelectedId,
      secondSelectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      activeExcludedId,
    );
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      costlyExcludedId,
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstSelectedId, secondSelectedId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstSelectedId, secondSelectedId]),
    );
    expect(
      view.players.north.characters.some((card) => card?.instanceId === activeExcludedId),
    ).toBe(true);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === costlyExcludedId),
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
