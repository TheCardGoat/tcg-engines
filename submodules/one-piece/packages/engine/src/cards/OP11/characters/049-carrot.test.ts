import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op11Carrot049 } from "../../../../../cards/src/cards/OP11/characters/049-carrot.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-049 Carrot", () => {
  test("on play orders the top three cards at the chosen end of the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Carrot049],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op11Carrot049.cost,
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 3);

    engine.playCard(op11Carrot049, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");
    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("on an opponent's attack may trash itself to give its Leader +1000 for that battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Carrot049] },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const carrotId = engine.findCardInZone("south", "character", op11Carrot049);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(carrotId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
