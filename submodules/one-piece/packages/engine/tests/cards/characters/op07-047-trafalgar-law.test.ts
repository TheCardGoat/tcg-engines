import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07TrafalgarLaw047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-047 Trafalgar Law", () => {
  test("may return itself before the opponent chooses one of six hand cards for deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07TrafalgarLaw047] },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
    );
    const lawId = engine.findCardInZone("south", "character", op07TrafalgarLaw047);
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Law's opponent hand choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(opponentHandIds);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [opponentHandIds[0]!] },
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lawId);
    expect(view.players.north.hand).toHaveLength(5);
    expect(engine.getState().players.north.deck.at(-1)).toBe(opponentHandIds[0]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the self-return cost before the six-card hand condition fails", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07TrafalgarLaw047] },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
    );
    const lawId = engine.findCardInZone("south", "character", op07TrafalgarLaw047);
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lawId);
    expect(engine.getState().players.north.hand).toEqual(opponentHandIds);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning itself or moving an opponent's hand card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07TrafalgarLaw047] },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
    );
    const lawId = engine.findCardInZone("south", "character", op07TrafalgarLaw047);
    const opponentHandIds = [...engine.getState().players.north.hand];

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === lawId)).toBe(true);
    expect(engine.getState().players.north.hand).toEqual(opponentHandIds);
    expect(view.prompts).toHaveLength(0);
  });
});
