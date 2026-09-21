import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { crossroadsSpecter } from "./crossroads-specter.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

const champion = enableAllTestElements(
  createClassBonusTestChampion(crossroadsSpecter, false, "activation-discount"),
);

/** @covers r3i9nmxhnb-a1 */
describe("Crossroads Specter — the hit opponent chooses from their material deck", () => {
  for (const targetChampion of [false, true])
    for (const materialCount of [0, 2]) {
      it(`champion hit=${targetChampion}, material cards=${materialCount}`, () => {
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [crossroadsSpecter], "material-deck": [trainingSword] },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "material-deck": Array.from({ length: materialCount }, () => trainingSword),
              hand: [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = q.card(champion);
        p.declareAttack(
          p.card(crossroadsSpecter),
          targetChampion ? hero : q.card(woodlandSquirrels, { zone: "field" }),
        );
        advanceCombatToTrigger(game, "r3i9nmxhnb-a1");
        passEffectsStack(game);
        if (targetChampion && materialCount) {
          expect(game.state.decision?.playerId).toBe(q.id);
          const cards = q.cards(trainingSword, { zone: "material-deck" });
          for (const invalid of [
            [],
            [cards[0]!.objectId, cards[1]!.objectId],
            [cards[0]!.objectId, cards[0]!.objectId],
            [p.card(trainingSword).objectId],
            [q.card(woodlandSquirrels, { zone: "hand" }).objectId],
            [hero.objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          }
          answerDecision(game, "resolve-effect-choice", [cards[1]!.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[cards[1]!.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[cards[0]!.objectId]!.zone).toBe("material-deck");
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(targetChampion ? 3 : 0);
        expect(q.cards(trainingSword, { zone: "banishment" })).toHaveLength(
          targetChampion && materialCount ? 1 : 0,
        );
        expect(p.cards(trainingSword, { zone: "material-deck" })).toHaveLength(1);
        expect(game.state.stack).toHaveLength(0);
      });
    }
});

/** @covers r3i9nmxhnb-a2 */
describe("Crossroads Specter — seven Regalia across both banishments", () => {
  for (const [own, opponent] of [
    [0, 0],
    [3, 3],
    [6, 0],
    [0, 6],
    [7, 0],
    [0, 7],
    [3, 4],
    [4, 4],
  ] as const) {
    it(`own Regalia=${own}, opposing Regalia=${opponent}`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [crossroadsSpecter, trainingSword],
            hand: [nocturnesOblivion, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            banishment: [
              ...Array.from({ length: own }, () => trainingSword),
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            graveyard: [trainingSword],
            "material-deck": [trainingSword],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: Array.from({ length: 4 }, () => enfeebledDagger),
            banishment: [
              ...Array.from({ length: opponent }, () => trainingSword),
              woodlandSquirrels,
            ],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(crossroadsSpecter),
        initial = game.state.objects[source.objectId]!.incarnation;
      p.activate(nocturnesOblivion, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      const returns = own + opponent >= 7;
      expect(game.state.objects[source.objectId]!.zone).toBe(returns ? "field" : "graveyard");
      if (!returns) return;
      expect(game.state.objects[source.objectId]!.incarnation).toBeGreaterThan(initial);
      expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(true);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
      for (const [index, dagger] of q.cards(enfeebledDagger).entries()) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        if (wait.playerId !== q.id) game.player(wait.playerId).pass();
        q.activateAbility(dagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          index === 3 ? "banishment" : "field",
        );
      }
      expect(p.cards(crossroadsSpecter, { zone: "field" })).toHaveLength(0);
      expect(p.cards(crossroadsSpecter, { zone: "graveyard" })).toHaveLength(0);
    });
  }
});

/** @covers r3i9nmxhnb-a2 */
describe("Crossroads Specter — death trigger response timing", () => {
  for (const removeSource of [false, true]) {
    it(
      removeSource
        ? "cannot retrieve a card already banished in response"
        : "counts the seventh Regalia banished after death",
      () => {
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [crossroadsSpecter, condemnedTrinket],
              hand: [nocturnesOblivion, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              banishment: Array.from({ length: removeSource ? 7 : 6 }, () => trainingSword),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [enfeebledDagger, condemnedTrinket],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(crossroadsSpecter);
        p.activate(nocturnesOblivion, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        for (
          let step = 0;
          game.state.objects[source.objectId]!.zone !== "graveyard" && step < 12;
          step++
        ) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(
          game.state.stack.some(
            (s) => s.kind === "triggered-ability" && s.ability.id === "r3i9nmxhnb-a2",
          ),
        ).toBe(true);
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        if (wait.playerId !== (removeSource ? p.id : q.id)) game.player(wait.playerId).pass();
        if (removeSource) {
          p.activateAbility(p.card(condemnedTrinket), "21oy1nd4nw-a1", {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          if (game.state.decision) answerDecision(game, "resolve-effect-choice", [source.objectId]);
        } else {
          q.activateAbility(q.card(enfeebledDagger), "idpdon8f0h-a1", {
            targets: { "target-unit": [q.card(champion).objectId] },
          });
        }
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          removeSource ? "banishment" : "field",
        );
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(removeSource ? 0 : 1);
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(!removeSource);
      },
    );
  }
});

/** @covers r3i9nmxhnb-a1 */
it("requires three reserve to enter and allows the hit opponent to banish a champion card", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { hand: [crossroadsSpecter, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: { champion, zones: { "material-deck": [champion, trainingSword] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const payment = p
    .cards(woodlandSquirrels)
    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const before = game.state;
  expect(() => p.activate(crossroadsSpecter, { reservePayment: payment.slice(0, 2) })).toThrow();
  expect(game.state).toEqual(before);
  p.activate(crossroadsSpecter, { reservePayment: payment });
  passEffectsStack(game);
  expect(p.cards(woodlandSquirrels, { zone: "memory" })).toHaveLength(3);
  const source = p.card(crossroadsSpecter);
  p.declareAttack(source, q.card(champion, { zone: "field" }));
  advanceCombatToTrigger(game, "r3i9nmxhnb-a1");
  passEffectsStack(game);
  const selected = q.card(champion, { zone: "material-deck" });
  expect(game.state.decision?.playerId).toBe(q.id);
  answerDecision(game, "resolve-effect-choice", [selected.objectId]);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
  expect(q.cards(trainingSword, { zone: "material-deck" })).toHaveLength(1);
});
