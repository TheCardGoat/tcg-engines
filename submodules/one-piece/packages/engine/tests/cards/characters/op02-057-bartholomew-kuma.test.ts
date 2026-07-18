import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02BartholomewKuma057,
  op02GeckoMoria054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-057 Bartholomew Kuma", () => {
  test("finds a compound Seven Warlords card, orders the remainder, and chooses the deck end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02BartholomewKuma057],
      deck: [op02GeckoMoria054, eb01Doma005, eb01Fourtricks025],
      activeDon: op02BartholomewKuma057.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op02GeckoMoria054);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op02BartholomewKuma057, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Kuma's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderPosition", "south").steps[0];
    expect(remainder?.kind).toBe("chooseOption");
    if (remainder?.kind !== "chooseOption") {
      throw new Error("Expected Kuma's remainder position choice.");
    }
    expect(remainder.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, unrelatedId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("orders two unselected cards before placing them on top", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02BartholomewKuma057],
      deck: [eb01Doma005, eb01Fourtricks025, op02GeckoMoria054],
      activeDon: op02BartholomewKuma057.cost,
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 2);
    const untouchedId = engine.findCardInZone("south", "deck", op02GeckoMoria054);

    engine.playCard(op02BartholomewKuma057, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Kuma's remainder order.");
    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectSearchRemainderPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectSearchRemainderPosition", { optionId: "top" }, "south");

    expect(engine.getState().players.south.deck).toEqual([...chosenOrder, untouchedId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
