import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { theLookingGlass } from "./the-looking-glass.ts";
import { tomeOfIgnorance } from "./tome-of-ignorance.ts";
import { rangerStrides } from "./ranger-strides.ts";
import { reckoningsWake } from "../actions/reckonings-wake.ts";
import { flowingOubli } from "../actions/flowing-oubli.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

const champion = createClassBonusTestChampion(theLookingGlass, false, "activation-discount");

/** @covers fln04uv297-a3 */
describe("The Looking Glass — optional Standard pregame action", () => {
  for (const accept of [false, true])
    it(`starts on the field only when its owner chooses it: accept=${accept}`, () => {
      const setup = (id: string) => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: 5 }],
        materialDeck: [champion, theLookingGlass, tomeOfIgnorance].map((card) => ({
          definitionId: card.canonicalId,
          count: 1,
        })),
      });
      const game = GrandArchiveTestEngine.start(
        [champion, theLookingGlass, tomeOfIgnorance, woodlandSquirrels],
        {
          mode: "standard",
          players: [setup("player-one"), setup("player-two")],
          firstPlayerId: "player-one",
          randomSeed: 1,
        },
        { validateDeckConstruction: false },
      );
      const p = game.player("player-one"),
        q = game.player("player-two");
      const glass = p.card(theLookingGlass, { zone: "material-deck" });
      expect(game.state.status).toBe("pregame");
      for (const invalid of [
        q.card(theLookingGlass, { zone: "material-deck" }),
        p.card(tomeOfIgnorance, { zone: "material-deck" }),
      ]) {
        const before = game.state;
        expect(() => p.execute({ move: "start-pregame-card", cardId: invalid.objectId })).toThrow();
        expect(game.state).toEqual(before);
      }
      if (accept) {
        p.execute({ move: "start-pregame-card", cardId: glass.objectId });
        expect(game.state.objects[glass.objectId]!.zone).toBe("field");
        expect(game.state.stack).toHaveLength(0);
        expect(p.zone("memory")).toHaveLength(0);
        const before = game.state;
        expect(() => p.execute({ move: "start-pregame-card", cardId: glass.objectId })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.execute({ move: "complete-pregame-actions" });
      q.execute({ move: "complete-pregame-actions" });
      expect(game.state.status).toBe("playing");
      expect(p.cards(champion, { zone: "field" })).toHaveLength(1);
      expect(game.state.objects[glass.objectId]!.zone).toBe(accept ? "field" : "material-deck");
      expect(q.cards(theLookingGlass, { zone: "material-deck" })).toHaveLength(1);
      const before = game.state;
      expect(() => p.execute({ move: "start-pregame-card", cardId: glass.objectId })).toThrow();
      expect(game.state).toEqual(before);
    });
});

/** @covers fln04uv297-a4 */
describe("The Looking Glass — controller's Distortion elemental exception", () => {
  for (const card of [tomeOfIgnorance, rangerStrides])
    for (const location of ["own-field", "opposing-field", "graveyard"] as const)
      it(`materializes ${card.slug} only with the Glass on its own field: ${location}`, () => {
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: location === "own-field" ? [theLookingGlass] : [],
              graveyard: location === "graveyard" ? [theLookingGlass] : [],
              "material-deck": [card],
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: location === "opposing-field" ? [theLookingGlass] : [] },
          },
        });
        const p = game.player("player-one");
        if (location !== "own-field") {
          const before = game.state;
          expect(() => p.materialize(card)).toThrow();
          expect(game.state).toEqual(before);
        } else {
          const memory = p.zone("memory")[0]!;
          p.materialize(card);
          expect(game.state.objects[memory.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          expect(p.cards(card, { zone: "field" })).toHaveLength(1);
        }
      });

  for (const ownGlass of [false, true])
    it(`ignores Umbra for a Distortion action but retains cost and non-Distortion restrictions: own=${ownGlass}`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: ownGlass ? [theLookingGlass] : [],
            hand: [
              reckoningsWake,
              flowingOubli,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: ownGlass ? [] : [theLookingGlass] } },
      });
      const p = game.player("player-one");
      const payment = (amount: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(flowingOubli, { reservePayment: payment(3) })).toThrow();
      expect(game.state).toEqual(before);
      expect(() => p.activate(reckoningsWake, { reservePayment: payment(1) })).toThrow();
      expect(game.state).toEqual(before);
      if (!ownGlass) {
        expect(() => p.activate(reckoningsWake, { reservePayment: payment(2) })).toThrow();
        expect(game.state).toEqual(before);
      } else {
        p.activate(reckoningsWake, { reservePayment: payment(2) });
        expect(p.zone("memory")).toHaveLength(2);
        passEffectsStack(game);
        expect(p.cards(reckoningsWake, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(1);
      }
    });
  it("loses the elemental exception immediately when the Glass leaves the field", () => {
    const cruxChampion = createClassBonusTestChampion(
      spiritsBlessing,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: cruxChampion,
        zones: {
          field: [theLookingGlass],
          hand: [
            reckoningsWake,
            reckoningsWake,
            spiritsBlessing,
            ...Array.from({ length: 5 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one");
    const payment = (amount: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, amount)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(p.cards(reckoningsWake)[0]!, { reservePayment: payment(2) });
    passEffectsStack(game);
    p.activate(spiritsBlessing, {
      reservePayment: payment(1),
      costSelections: [[p.card(theLookingGlass).objectId]],
    });
    expect(p.cards(theLookingGlass, { zone: "material-deck" })).toHaveLength(1);
    const before = game.state;
    expect(() =>
      p.activate(p.card(reckoningsWake, { zone: "hand" }), { reservePayment: payment(2) }),
    ).toThrow();
    expect(game.state).toEqual(before);
    passEffectsStack(game);
    expect(p.zone("main-deck")).toHaveLength(0);
  });
});
