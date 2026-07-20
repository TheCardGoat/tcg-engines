import { eb01Doma005, eb02ThePeak008, op02Uta120, op13Sanji027 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Gordon024 } from "../../../../../cards/src/cards/OP13/characters/024-gordon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-024 Gordon", () => {
  test("reveals either Music or FILM, then sets two DON!! active only at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Gordon024, eb02ThePeak008, op02Uta120, op13Sanji027, eb01Doma005],
      activeDon: op13Gordon024.cost,
      restedDon: 2,
    });
    const musicId = engine.findCardInZone("south", "hand", eb02ThePeak008);
    const filmId = engine.findCardInZone("south", "hand", op02Uta120);
    const joinedFilmId = engine.findCardInZone("south", "hand", op13Sanji027);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Gordon024, "south");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    expect(reveal).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (reveal?.kind !== "payCost") throw new Error("Expected Gordon's reveal payment.");
    const candidates = reveal.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual(expect.arrayContaining([musicId, filmId, joinedFilmId]));
    expect(candidates).not.toContain(excludedId);
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: [joinedFilmId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      joinedFilmId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.endTurn("south");
    const setActive = engine.pendingDecision("effectSetActiveDon", "south");
    expect(setActive.actorId).toBe("south");
    expect(setActive.steps[0]).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without revealing a card or scheduling end-turn DON!! activation", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Gordon024, eb02ThePeak008],
      activeDon: op13Gordon024.cost,
      restedDon: 2,
    });
    const musicId = engine.findCardInZone("south", "hand", eb02ThePeak008);

    engine.playCard(op13Gordon024, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(musicId);
    expect(view.prompts).toHaveLength(0);
  });
});
