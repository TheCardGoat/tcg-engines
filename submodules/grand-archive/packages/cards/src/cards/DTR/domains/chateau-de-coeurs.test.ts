import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chateauDeCoeurs } from "./chateau-de-coeurs.ts";
import { attuneWithTheWinds } from "../../DOA/actions/attune-with-the-winds.ts";
import { soothingDisillusion } from "../../AMB/actions/soothing-disillusion.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers vxc8u5zz08-a1 */
describe("Chateau de Coeurs — opposing buff removal on entry", () => {
  for (const count of [0, 1, 3])
    it(`removes all ${count} buffs from each opposing ally only when its entry trigger resolves`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(chateauDeCoeurs, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [giantTortoise, giantTortoise, trainingSword],
            hand: [
              chateauDeCoeurs,
              attuneWithTheWinds,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, giantTortoise, trainingSword],
            hand: [
              ...Array.from({ length: count }, () => attuneWithTheWinds),
              ...Array.from({ length: 3 * count }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (player: typeof p, amount: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      for (let i = 0; i < count; i++) {
        q.activate(q.cards(attuneWithTheWinds, { zone: "hand" })[0]!, {
          reservePayment: payment(q, 3),
        });
        passEffectsStack(game);
      }
      advanceToMain(game, p.id);
      p.activate(attuneWithTheWinds, { reservePayment: payment(p, 3) });
      passEffectsStack(game);
      const opponents = q.cards(giantTortoise, { zone: "field" }),
        own = p.cards(giantTortoise, { zone: "field" });
      for (const ally of opponents)
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(count);
      for (const ally of own) expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
      const source = p.card(chateauDeCoeurs),
        before = game.state;
      expect(() => p.activate(source, { reservePayment: payment(p, 2) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { reservePayment: payment(p, 3) });
      p.pass();
      q.pass();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "vxc8u5zz08-a1",
        ),
      ).toBe(true);
      for (const ally of opponents)
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(count);
      passEffectsStack(game);
      for (const ally of opponents)
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
      for (const ally of own) expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
      for (const player of [p, q])
        expect(game.state.objects[player.card(trainingSword).objectId]!.counters.durability).toBe(
          2,
        );
      expect(game.state.objects[source.objectId]!.counters.durability).toBe(5);
      p.declareAttack(own[0]!, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
      advanceToMain(game, q.id);
      q.declareAttack(opponents[0]!, p.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    });
});

/** @covers vxc8u5zz08-a2 */
describe("Chateau de Coeurs — recipient control determines buff prohibition", () => {
  for (const opposing of [false, true])
    it(`applies dynamically to a newly entered ally: opposing=${opposing}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(chateauDeCoeurs, false, "activation-discount"),
      );
      const supplies = {
        hand: [soothingDisillusion, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opposing ? "playerTwo" : "playerOne",
        playerOne: { champion, zones: { ...supplies, field: [chateauDeCoeurs] } },
        playerTwo: { champion, zones: supplies },
      });
      const player = game.player(opposing ? "player-two" : "player-one");
      const ally = player.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      player.activate(ally);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.zone).toBe("field");
      player.activate(soothingDisillusion, {
        modeIds: ["mode-2"],
        targets: { "target-1": [ally.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(opposing ? 0 : 1);
      expect(player.cards(soothingDisillusion, { zone: "graveyard" })).toHaveLength(1);
    });

  for (const zone of ["field", "graveyard"] as const)
    for (const opposingActor of [false, true])
      for (const opposingRecipient of [false, true])
        it(`${zone}, opposing actor=${opposingActor}, opposing recipient=${opposingRecipient}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(chateauDeCoeurs, false, "activation-discount"),
          );
          const supplies = {
            field: [giantTortoise],
            hand: [
              soothingDisillusion,
              soothingDisillusion,
              nocturnesOblivion,
              ...Array.from({ length: 7 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          };
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposingActor ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                ...supplies,
                field: [giantTortoise, ...(zone === "field" ? [chateauDeCoeurs] : [])],
                graveyard: zone === "graveyard" ? [chateauDeCoeurs] : [],
              },
            },
            playerTwo: { champion, zones: supplies },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposingActor ? q : p,
            recipient = opposingRecipient ? q : p;
          const target = recipient.card(giantTortoise),
            source = p.card(chateauDeCoeurs);
          const payment = (amount: number) =>
            actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, amount)
              .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
          const buff = () => {
            const memory = actor.zone("memory").length;
            actor.activate(actor.cards(soothingDisillusion, { zone: "hand" })[0]!, {
              modeIds: ["mode-2"],
              targets: { "target-1": [target.objectId] },
              reservePayment: payment(2),
            });
            passEffectsStack(game);
            expect(actor.zone("memory")).toHaveLength(memory + 2);
          };
          buff();
          const first = zone === "field" && opposingRecipient ? 0 : 1;
          expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(first);
          if (zone === "field") {
            actor.activate(nocturnesOblivion, {
              targets: { "target-1": [source.objectId] },
              reservePayment: payment(3),
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          }
          buff();
          expect(game.state.objects[target.objectId]!.counters.buff).toBe(first + 1);
          if (game.state.turn.playerId !== recipient.id) advanceToMain(game, recipient.id);
          const defender = recipient.id === p.id ? q : p;
          recipient.declareAttack(target, defender.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[defender.card(champion).objectId]!.damage).toBe(first + 2);
        });
});
