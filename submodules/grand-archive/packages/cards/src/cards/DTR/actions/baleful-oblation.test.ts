import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { balefulOblation } from "./baleful-oblation.ts";
import { backdash } from "./backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers oye74ibwo8-a1 */
describe("Baleful Oblation — Ciel activation discount", () => {
  for (const ciel of [false, true])
    it(`Ciel=${ciel}`, () => {
      const champion = createLineageTestChampion(balefulOblation, ciel ? "Ciel" : "Other");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [balefulOblation, ...Array.from({ length: 5 }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion: createLineageTestChampion(balefulOblation, "Ciel") },
      });
      const p = game.player("player-one"),
        cost = ciel ? 3 : 5;
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(balefulOblation, { reservePayment: payment.slice(0, cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(balefulOblation, { reservePayment: payment.slice(0, cost) });
      expect(p.zone("memory")).toHaveLength(cost);
      expect(p.zone("hand")).toHaveLength(5 - cost);
      passEffectsStack(game);
      expect(p.cards(balefulOblation, { zone: "graveyard" })).toHaveLength(1);
    });
});

/** @covers oye74ibwo8-a2 */
describe("Baleful Oblation — lowest owned omen cost and excluded champion", () => {
  const scenarios = [
    { name: "no omens", omens: [], damage: 0 },
    { name: "zero cost", omens: [woodlandSquirrels], damage: 0 },
    { name: "one cost", omens: [backdash], damage: 1 },
    { name: "four cost", omens: [giantTortoise], damage: 4 },
    { name: "low then high", omens: [backdash, giantTortoise], damage: 1 },
    { name: "high then low", omens: [giantTortoise, backdash], damage: 1 },
    { name: "matching high costs", omens: [giantTortoise, giantTortoise], damage: 4 },
    { name: "zero among high", omens: [giantTortoise, woodlandSquirrels], damage: 0 },
  ];
  for (const ciel of [false, true])
    for (const scenario of scenarios)
      it(`${scenario.name}, Ciel=${ciel}`, () => {
        const champion = createLineageTestChampion(balefulOblation, ciel ? "Ciel" : "Other");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                giantTortoise,
                giantTortoise,
                woodlandSquirrels,
                trainingSword,
                ...scenario.omens.map(() => condemnedTrinket),
              ],
              hand: [
                balefulOblation,
                ...Array.from({ length: 5 + 3 * scenario.omens.length }, () => woodlandSquirrels),
              ],
              graveyard: [...scenario.omens, woodlandSquirrels],
              banishment: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [
                giantTortoise,
                giantTortoise,
                woodlandSquirrels,
                trainingSword,
                condemnedTrinket,
              ],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (player: typeof p, n: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(q, 3) });
        passEffectsStack(game);
        advanceToMain(game, p.id);
        for (const card of scenario.omens) {
          const selected = p.cards(card, { zone: "graveyard" })[0]!;
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(p, 3),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        }
        const ownChampion = p.card(champion),
          otherChampion = q.card(champion);
        const bigAllies = [
          ...p.cards(giantTortoise, { zone: "field" }),
          ...q.cards(giantTortoise, { zone: "field" }),
        ];
        const smallAllies = [
          p.card(woodlandSquirrels, { zone: "field" }),
          q.card(woodlandSquirrels, { zone: "field" }),
        ];
        p.activate(balefulOblation, { reservePayment: payment(p, ciel ? 3 : 5) });
        for (const card of [...bigAllies, otherChampion])
          expect(game.state.objects[card.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
        expect(game.state.objects[otherChampion.objectId]!.damage).toBe(scenario.damage);
        for (const card of bigAllies)
          expect(game.state.objects[card.objectId]!.damage).toBe(scenario.damage);
        for (const card of smallAllies)
          expect(game.state.objects[card.objectId]!.zone).toBe(
            scenario.damage ? "graveyard" : "field",
          );
        for (const player of [p, q])
          expect(game.state.objects[player.card(trainingSword).objectId]!.counters.durability).toBe(
            2,
          );
        expect(p.cards(balefulOblation, { zone: "graveyard" })).toHaveLength(1);
      });
  for (const lower of [
    { card: backdash, damage: 1 },
    { card: woodlandSquirrels, damage: 0 },
  ])
    it(`uses the lower omen created in response: ${lower.damage}`, () => {
      const champion = createLineageTestChampion(balefulOblation, "Ciel");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [condemnedTrinket, condemnedTrinket, giantTortoise],
            hand: [balefulOblation, ...Array.from({ length: 9 }, () => woodlandSquirrels)],
            graveyard: [giantTortoise, backdash, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [giantTortoise] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
        reservePayment: payment(),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [
        p.card(giantTortoise, { zone: "graveyard" }).objectId,
      ]);
      passEffectsStack(game);
      p.activate(balefulOblation, { reservePayment: payment() });
      p.activateAbility(p.card(condemnedTrinket, { zone: "field" }), "21oy1nd4nw-a1", {
        reservePayment: payment(),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [
        p.card(lower.card, { zone: "graveyard" }).objectId,
      ]);
      passEffectsStack(game);
      for (const player of [p, q])
        expect(
          game.state.objects[player.card(giantTortoise, { zone: "field" }).objectId]!.damage,
        ).toBe(lower.damage);
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(lower.damage);
    });
});
