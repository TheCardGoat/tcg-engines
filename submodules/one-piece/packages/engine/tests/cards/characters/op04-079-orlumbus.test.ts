import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Fukurou088,
  op04Orlumbus079,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const protectedDressrosaCharacter: CharacterCard = {
  ...op03Fukurou088,
  id: "TEST-OP04-079-PROTECTED-DRESSROSA",
  canonicalId: "TEST-OP04-079-PROTECTED-DRESSROSA",
  name: "Protected Dressrosa Character",
  traits: ["Dressrosa", "Test Fleet"],
};

registerCards([protectedDressrosaCharacter]);

describe("OP04-079 Orlumbus", () => {
  test("reduces up to one cost, must trash the top two, then must K.O. its only Dressrosa Character", () => {
    expect(op04Orlumbus079.traits).toEqual(["Dressrosa", "Yonta Maria Fleet"]);

    const engine = OnePieceTestEngine.create(
      {
        character: [op04Orlumbus079],
        deck: [eb01Doma005, eb01MountainGod018, eb01Fourtricks025],
      },
      { character: [eb01MountainGod018] },
    );
    const orlumbusId = engine.findCardInZone("south", "character", op04Orlumbus079);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const opposingCost = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === opposingId)?.cost;
    const deckBefore = [...engine.getState().players.south.deck];
    const trashedDeckIds = deckBefore.slice(0, 2);
    const untouchedDeckId = deckBefore[2];

    engine.activateEffect(orlumbusId, "activateMain", "south");
    const costTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(costTarget?.kind).toBe("selectEntity");
    if (costTarget?.kind !== "selectEntity") throw new Error("Expected Orlumbus's cost target.");
    expect(costTarget).toMatchObject({ min: 0, max: 1 });
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).toContain(opposingId);
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(orlumbusId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.cost,
    ).toBe(Math.max(0, (opposingCost ?? 0) - 4));
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([...trashedDeckIds, orlumbusId]),
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === orlumbusId)).toBe(
      false,
    );
    // Deck order is hidden; raw state is the narrow exact top-card identity boundary.
    expect(engine.getState().players.south.deck).toEqual([untouchedDeckId]);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.cost,
    ).toBe(opposingCost);
  });

  test("may choose zero opposing Characters, then excludes protected Dressrosa from the mandatory K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Orlumbus079, protectedDressrosaCharacter],
        deck: [eb01Doma005, eb01MountainGod018, eb01Fourtricks025],
      },
      { character: [eb01MountainGod018] },
    );
    const orlumbusId = engine.findCardInZone("south", "character", op04Orlumbus079);
    const protectedId = engine.findCardInZone("south", "character", protectedDressrosaCharacter);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const opposingCost = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === opposingId)?.cost;
    const deckBefore = [...engine.getState().players.south.deck];
    const trashedDeckIds = deckBefore.slice(0, 2);
    const untouchedDeckId = deckBefore[2];

    engine.activateEffect(orlumbusId, "activateMain", "south");
    const costTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(costTarget?.kind).toBe("selectEntity");
    if (costTarget?.kind !== "selectEntity") throw new Error("Expected Orlumbus's cost target.");
    expect(costTarget).toMatchObject({ min: 0, max: 1 });
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const koTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(koTarget?.kind).toBe("selectEntity");
    if (koTarget?.kind !== "selectEntity") throw new Error("Expected mandatory Dressrosa K.O.");
    expect(koTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([orlumbusId]);
    expect(koTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [orlumbusId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.cost,
    ).toBe(opposingCost);
    expect(view.players.south.characters.some((card) => card?.instanceId === orlumbusId)).toBe(
      false,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === protectedId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([...trashedDeckIds, orlumbusId]),
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedDeckId]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: orlumbusId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
