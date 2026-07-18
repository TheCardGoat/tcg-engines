import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01TonyTonyChopper006,
  op04Chaka008,
  op14eb04Terracotta024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB04-024 Terracotta", () => {
  test("rests itself and trashes a hand card to make a chosen Alabasta Character unblockable", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [op14eb04Terracotta024, { card: op04Chaka008, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        character: [eb01TonyTonyChopper006],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const terracottaId = engine.findCardInZone("south", "character", op14eb04Terracotta024);
    const chakaId = engine.findCardInZone("south", "character", op04Chaka008);
    const nonAlabastaId = engine.findCardInZone("south", "character", eb01Doma005);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

    engine.activateEffect(terracottaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Terracotta's recipient.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([terracottaId, chakaId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonAlabastaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [chakaId] }, "south");

    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(chakaId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === terracottaId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });
});
