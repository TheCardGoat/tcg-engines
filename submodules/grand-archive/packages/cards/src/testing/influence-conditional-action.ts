import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveInfluenceConditionalAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  recover: boolean,
) {
  const cost = recover ? 2 : 3;
  for (const mode of ["hand", "memory", "split", "response"])
    for (const delta of mode === "response" ? [1] : [-1, 0, 1])
      for (const damage of recover ? [0, 2, 6] : [0])
        it(`compares influence strictly at resolution: mode=${mode}, delta=${delta}, damage=${damage}`, () => {
          const champion = enableAllTestElements(lineageTestChampion("Influence", 0));
          const ownInfluence = cost + damage + 2;
          const opposingInfluence = ownInfluence + delta;
          const memory =
            mode === "memory"
              ? opposingInfluence
              : mode === "split"
                ? Math.floor(opposingInfluence / 2)
                : 0;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  ...Array.from({ length: damage / 2 }, () => sparkAlight),
                  ...Array.from({ length: ownInfluence }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [
                  ...(mode === "response" ? [sparkAlight] : []),
                  ...Array.from(
                    { length: opposingInfluence - memory - (mode === "response" ? 1 : 0) },
                    () => woodlandSquirrels,
                  ),
                ],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const source of p.cards(sparkAlight, { zone: "hand" })) {
            p.activate(source, {
              reservePayment: pay(2),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
          }
          expect(p.zone("hand").length + p.zone("memory").length).toBe(ownInfluence + 1);
          const before = game.state;
          for (const invalid of [p.id, hero.objectId]) {
            expect(() =>
              p.activate(card, {
                reservePayment: pay(cost),
                targets: { "target-opponent": [invalid] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const deck = p.zone("main-deck"),
            opposingDeck = q.zone("main-deck");
          p.activate(card, { reservePayment: pay(cost), targets: { "target-opponent": [q.id] } });
          expect(p.zone("hand").length + p.zone("memory").length).toBe(ownInfluence);
          expect(p.zone("main-deck")).toEqual(deck);
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          if (mode === "response") {
            p.pass();
            q.activate(sparkAlight, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
              targets: { "target-1": [foe.objectId] },
            });
          }
          passEffectsStack(game);
          const applies = delta > 0 && mode !== "response";
          expect(q.zone("hand").length + q.zone("memory").length).toBe(
            opposingInfluence - (mode === "response" ? 1 : 0),
          );
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            recover && applies ? Math.max(0, damage - 4) : damage,
          );
          expect(game.state.objects[foe.objectId]!.damage).toBe(mode === "response" ? 2 : 0);
          expect(p.zone("memory")).toHaveLength(cost + damage + (!recover && applies ? 1 : 0));
          if (!recover && applies) expect(p.zone("memory")).toContainEqual(deck[0]);
          expect(p.zone("main-deck")).toEqual(deck.slice(!recover && applies ? 1 : 0));
          expect(q.zone("main-deck")).toEqual(opposingDeck);
          expect(p.zone("hand")).toHaveLength(2);
          expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        });
}

import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import { advanceToMain } from "./decisions.ts";

export function proveSelectedOpponentInfluence(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  recover: boolean,
) {
  for (const selected of ["player-two", "player-three"])
    it(`uses only selected opponent ${selected} in a three-player game`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Selected influence", 0));
      const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [
          {
            definitionId: id === "player-one" ? card.canonicalId : woodlandSquirrels.canonicalId,
            count: 40,
          },
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [
          champion,
          card,
          woodlandSquirrels,
          lesserBoonOfApollo,
          greaterBoonOfHorses,
          pantheonBarrier,
        ],
        {
          mode: "pantheon",
          firstPlayerId: "player-one",
          randomSeed: 43,
          players: [setup("player-one"), setup("player-two"), setup("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        q = game.player("player-two"),
        r = game.player("player-three"),
        hero = p.card(champion);
      for (let turn = 0; turn < 8; turn++) advanceToMain(game, p.id, game.state.turn.number);
      advanceToMain(game, q.id);
      for (const source of q.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 3)) {
        q.activate(source);
        passEffectsStack(game);
      }
      advanceToMain(game, q.id, game.state.turn.number);
      // The first six damage remove the Pantheon Barrier; the last three
      // damage the champion through normal combat in the following turn.
      for (let round = 0; round < 3; round++) {
        for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
          q.declareAttack(attacker, hero);
          game.resolveCombatWithoutRetaliation();
        }
        if (round < 2) advanceToMain(game, q.id, game.state.turn.number);
      }
      advanceToMain(game, p.id);
      expect(p.cards(pantheonBarrier, { zone: "field" })).toHaveLength(0);
      expect(game.state.objects[hero.objectId]!.damage).toBe(3);
      const cost = recover ? 2 : 3;
      const [preparation, ...preparationPayment] = p.cards(card, { zone: "hand" });
      const originalDeck = p.zone("main-deck");
      p.activate(preparation!, {
        reservePayment: preparationPayment
          .slice(0, cost)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-opponent": [q.id] },
      });
      passEffectsStack(game);
      expect(p.zone("main-deck")).toEqual(originalDeck);
      expect(game.state.objects[hero.objectId]!.damage).toBe(3);
      const [source, ...others] = p.cards(card, { zone: "hand" });
      const deck = p.zone("main-deck");
      p.activate(source!, {
        reservePayment: others
          .slice(0, cost)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-opponent": [game.player(selected).id] },
      });
      const influence = (id: string) =>
        game.player(id).zone("hand").length + game.player(id).zone("memory").length;
      expect(influence(q.id)).toBeLessThan(influence(p.id));
      expect(influence(r.id)).toBeGreaterThan(influence(p.id));
      const opponentDecks = [q.zone("main-deck"), r.zone("main-deck")];
      passEffectsStack(game);
      const applies = selected === r.id;
      expect(game.state.objects[hero.objectId]!.damage).toBe(recover && applies ? 0 : 3);
      expect(p.zone("memory")).toHaveLength(2 * cost + (!recover && applies ? 1 : 0));
      if (!recover && applies) expect(p.zone("memory")).toContainEqual(deck[0]);
      expect(p.zone("main-deck")).toEqual(deck.slice(!recover && applies ? 1 : 0));
      expect([q.zone("main-deck"), r.zone("main-deck")]).toEqual(opponentDecks);
    });
}
