import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06VinsmokeReiju042,
  op11VinsmokeYonji046,
} from "@tcg/op-cards";
import { op11VinsmokeReiju047 } from "../../../../../cards/src/cards/OP11/characters/047-vinsmoke-reiju.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-047 Vinsmoke Reiju", () => {
  test("with an included Vinsmoke Family Leader, finds only an included GERMA card and trashes the rest", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op11VinsmokeReiju047],
      deck: [
        op11VinsmokeYonji046,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op11VinsmokeReiju047.cost,
    });
    const yonjiId = engine.findCardInZone("south", "deck", op11VinsmokeYonji046);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op11VinsmokeReiju047, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Reiju's GERMA search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === yonjiId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [yonjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(yonjiId);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not search without a Vinsmoke Family Leader", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11VinsmokeReiju047],
      deck: [op11VinsmokeYonji046, eb01Doma005, eb01Fourtricks025],
      activeDon: op11VinsmokeReiju047.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op11VinsmokeReiju047, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
