import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Karoo004, op04TonyTonyChopper010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-010 Tony Tony.Chopper", () => {
  test("plays the selected physical included Animal Character with 3000 power or less", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op04TonyTonyChopper010,
        op04Karoo004,
        op04Karoo004,
        eb01Doma005,
        op04TonyTonyChopper010,
      ],
      activeDon: op04TonyTonyChopper010.cost,
    });
    const nonAnimalId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op04TonyTonyChopper010, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Chopper's Animal play choice.");
    const eligibleIds = play.candidates.map((candidate) => candidate.ref.id);
    expect(eligibleIds).toHaveLength(2);
    expect(eligibleIds).not.toContain(nonAnimalId);
    const selectedKarooId = eligibleIds[1]!;
    const preservedKarooId = eligibleIds[0]!;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedKarooId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === selectedKarooId)).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(preservedKarooId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may play no Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04TonyTonyChopper010, op04Karoo004],
      activeDon: op04TonyTonyChopper010.cost,
    });
    const karooId = engine.findCardInZone("south", "hand", op04Karoo004);

    engine.playCard(op04TonyTonyChopper010, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(karooId);
    expect(view.players.south.characters.some((card) => card?.instanceId === karooId)).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
