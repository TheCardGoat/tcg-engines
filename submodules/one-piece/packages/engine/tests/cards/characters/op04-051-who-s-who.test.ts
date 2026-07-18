import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Kuro023,
  op04WhoSWho051,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-051 Who's.Who", () => {
  test("finds an included Animal Kingdom Pirates type but excludes its own name", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04WhoSWho051],
      deck: [
        eb01Fourtricks025,
        op04WhoSWho051,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        op04Kuro023,
      ],
      activeDon: 1,
    });
    const compoundTraitId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const excludedNameId = engine.findCardInZone("south", "deck", op04WhoSWho051);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op04Kuro023);

    engine.playCard(op04WhoSWho051, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Who's.Who's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundTraitId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") {
      throw new Error("Expected Who's.Who's bottom-deck order.");
    }
    const remainderOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundTraitId);
    // Exact hidden deck order is not projected; this is the narrow identity boundary.
    expect(engine.getState().players.south.deck).toEqual([untouchedBottomId, ...remainderOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may reveal zero cards and order all five looked cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04WhoSWho051],
      deck: [
        eb01Fourtricks025,
        op04WhoSWho051,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        op04Kuro023,
      ],
      activeDon: op04WhoSWho051.cost,
    });
    const untouchedBottomId = engine.findCardInZone("south", "deck", op04Kuro023);

    engine.playCard(op04WhoSWho051, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Who's.Who's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual([untouchedBottomId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
