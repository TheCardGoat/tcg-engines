import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01OffWhite019,
  op04WeaknessIsAnUnforgivableSin076,
  op10DonquixoteRosinante072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-072 Donquixote Rosinante", () => {
  test("may trash exactly an Event from hand to draw two cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op10DonquixoteRosinante072,
        eb01OffWhite019,
        op04WeaknessIsAnUnforgivableSin076,
        eb01Doma005,
      ],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op10DonquixoteRosinante072.cost,
    });
    const eventId = engine.findCardInZone("south", "hand", eb01OffWhite019);
    const otherEventId = engine.findCardInZone("south", "hand", op04WeaknessIsAnUnforgivableSin076);
    const characterId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = [...engine.getState().players.south.deck];

    engine.playCard(op10DonquixoteRosinante072, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Rosinante's Event trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(otherEventId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([otherEventId, characterId, ...drawnIds]),
    );
    expect(view.players.south.deckCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("with seven DON!! on its field sets up to two rested DON!! active at turn end", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10DonquixoteRosinante072],
      activeDon: 4,
      restedDon: 3,
    });

    engine.endTurn("south");
    const refresh = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (refresh?.kind !== "chooseOption") throw new Error("Expected Rosinante's DON!! count.");
    expect(refresh.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 6, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });
});
