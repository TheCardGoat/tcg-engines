import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05UpperYard117,
  op06Raki113,
  op06Wyper114,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-114 Wyper", () => {
  test("bottom-decks a cost-1 Stage before searching an Upper Yard or Shandian Warrior card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Wyper114],
        deck: [
          op06Raki113,
          op05UpperYard117,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
        activeDon: op06Wyper114.cost,
      },
      { stage: op05UpperYard117 },
    );
    const stageId = engine.findCardInZone("north", "stage", op05UpperYard117);
    const warriorId = engine.findCardInZone("south", "deck", op06Raki113);
    const upperYardId = engine.findCardInZone("south", "deck", op05UpperYard117);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op06Wyper114, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Wyper's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === warriorId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === upperYardId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [warriorId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Wyper's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.north.stage).toBeNull();
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(warriorId);
    expect(engine.getState().players.north.deck).toContain(stageId);
    expect(view.prompts).toHaveLength(0);
  });
});
