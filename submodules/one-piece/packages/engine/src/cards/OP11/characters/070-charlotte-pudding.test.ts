import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11CharlotteLinlin073 } from "@tcg/op-cards";
import { op11CharlottePudding070 } from "../../../../../cards/src/cards/OP11/characters/070-charlotte-pudding.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-070 Charlotte Pudding", () => {
  test("searches the top five for an eligible included Big Mom Pirates card and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11CharlottePudding070],
      deck: [
        op11CharlotteLinlin073,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op11CharlottePudding070.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op11CharlotteLinlin073);

    engine.playCard(op11CharlottePudding070, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Pudding's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("can activate its printed Main effect to look at the opponent's top card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlottePudding070], activeDon: 1 },
      { deck: [eb01Doma005, eb01Doma005] },
    );
    const puddingId = engine.findCardInZone("south", "character", op11CharlottePudding070);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(puddingId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const controllerView = engine.getView("south");
    expect(controllerView.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(
      controllerView.players.south.characters.find((card) => card?.instanceId === puddingId)
        ?.rested,
    ).toBe(true);
    expect(controllerView.logs.some((entry) => entry.message.includes(eb01Doma005.name))).toBe(
      true,
    );
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes(eb01Doma005.name)),
    ).toBe(false);
    expect(controllerView.prompts).toHaveLength(0);
  });
});
