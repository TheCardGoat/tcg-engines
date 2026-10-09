import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Nami036,
  op02Brook040,
  op02MonkeyDLuffy041,
  op13NicoRobin032,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function resolveSearchRemainder(engine: OnePieceTestEngine) {
  const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
  expect(remainder?.kind).toBe("orderItems");
  if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's remainder order.");
  engine.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
    "south",
  );
}

describe("OP02-036 Nami", () => {
  test.each(["on play", "when attacking"])(
    "may pay 1 DON!! %s to find a compound FILM card other than Nami",
    (timing) => {
      const engine = OnePieceTestEngine.create({
        hand: timing === "on play" ? [op02Nami036] : [],
        character: timing === "when attacking" ? [op02Nami036] : [],
        deck: [op13NicoRobin032, op02Nami036, eb01Doma005],
        activeDon: timing === "on play" ? op02Nami036.cost + 1 : 1,
      });
      const robinId = engine.findCardInZone("south", "deck", op13NicoRobin032);
      const namiId = engine.findCardInZone("south", "deck", op02Nami036);
      const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

      if (timing === "on play") {
        engine.playCard(op02Nami036, "south");
      } else {
        engine.declareAttack(
          engine.findCardInZone("south", "character", op02Nami036),
          engine.leader("north"),
          "south",
        );
      }
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

      const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
      expect(search?.kind).toBe("selectEntity");
      if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
      expect(search.candidates.find((candidate) => candidate.ref.id === robinId)?.legal).toBe(true);
      expect(search.candidates.find((candidate) => candidate.ref.id === namiId)?.legal).toBe(false);
      expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
        false,
      );
      engine.resolveDecision("effectSearchSelection", { selectedIds: [robinId] }, "south");
      resolveSearchRemainder(engine);

      const view = engine.getView("south");
      expect(view.players.south.hand.map((card) => card.instanceId)).toContain(robinId);
      expect(view.players.south).toMatchObject({
        activeDon: 0,
        restedDon: timing === "on play" ? 4 : 1,
      });
      expect(view.prompts).toHaveLength(0);
    },
  );

  test.each([op02Brook040, op02MonkeyDLuffy041])(
    "searches the official FILM type on $id",
    (film) => {
      const engine = OnePieceTestEngine.create({
        hand: [op02Nami036],
        activeDon: 4,
        deck: [op02Brook040, op02MonkeyDLuffy041, eb01Doma005],
      });
      const selectedId = engine.findCardInZone("south", "deck", film);
      engine.playCard(op02Nami036);
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
      if (search?.kind !== "selectEntity") throw new Error("Expected Nami's FILM search.");
      expect(
        search.candidates
          .filter((candidate) => candidate.legal)
          .map((candidate) => candidate.ref.id),
      ).toEqual([
        engine.findCardInZone("south", "deck", op02Brook040),
        engine.findCardInZone("south", "deck", op02MonkeyDLuffy041),
      ]);
      engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
      resolveSearchRemainder(engine);
      expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual([
        selectedId,
      ]);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("may decline the When Attacking search without resting DON!! or changing the deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Nami036, playedOnTurn: 0 }],
        deck: [op13NicoRobin032, eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const namiId = engine.findCardInZone("south", "character", op02Nami036);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.declareAttack(namiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
