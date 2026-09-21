import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cielMiragesGrave } from "./ciel-mirages-grave.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { evasivePositioning } from "../actions/evasive-positioning.ts";
import { backdash } from "../actions/backdash.ts";
import { aethercloakSentinel } from "../allies/aethercloak-sentinel.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers zhh43i1eaa-a1 */
describe("Ciel, Mirage's Grave — Ciel Lineage", () => {
  proveChampionLineage({ card: cielMiragesGrave, lineageName: "Ciel", level: 3, memoryCost: 3 });
});

/** @covers zhh43i1eaa-a2 */
describe("Ciel, Mirage's Grave — omen-triggered unpreventable Spell damage", () => {
  for (const targetKind of [
    "none",
    "own-champion",
    "opponent-champion",
    "own-ally",
    "opponent-ally",
  ] as const)
    for (const shield of [false, true])
      it(`target=${targetKind}, existing shield=${shield}`, () => {
        const opponentChampion = createClassBonusTestChampion(
          evasivePositioning,
          false,
          "activation-discount",
        );
        const starter = lineageTestChampion("Ciel", 0);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: [
              lineageTestChampion("Ciel", 1),
              lineageTestChampion("Ciel", 2),
              cielMiragesGrave,
            ],
            zones: {
              field: [condemnedTrinket, condemnedTrinket, giantTortoise],
              hand: [evasivePositioning, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
              graveyard: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, backdash],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponentChampion,
            zones: {
              field: [condemnedTrinket, enfeebledDagger, giantTortoise, aethercloakSentinel],
              hand: [tombSweep, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              graveyard: [woodlandSquirrels, backdash],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(starter, { zone: "field" }),
          enemyHero = q.card(opponentChampion);
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          q.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
        ]);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        const ordinaryBanish = p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!;
        q.activate(tombSweep, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-card": [ordinaryBanish.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[ordinaryBanish.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[ordinaryBanish.objectId]!.counters.omen ?? 0).toBe(0);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        advanceToMain(game, p.id);
        const target =
          targetKind === "own-champion"
            ? hero
            : targetKind === "own-ally"
              ? p.card(giantTortoise)
              : targetKind === "opponent-ally"
                ? q.card(giantTortoise)
                : enemyHero;
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (shield) {
          p.activate(evasivePositioning, {
            reservePayment: payment(1),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
        }
        const trigger = () => {
          const card = p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!;
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(3),
          });
          passEffectsStack(game);
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          answerDecision(game, "resolve-effect-choice", [card.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[card.objectId]!.counters.omen).toBe(1);
          expect(game.state.decision).toMatchObject({
            kind: "announce-triggered-ability",
            playerId: p.id,
          });
        };
        trigger();
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        for (const invalid of [
          [q.card(enfeebledDagger).objectId],
          [q.card(aethercloakSentinel).objectId],
          [p.card(backdash, { zone: "graveyard" }).objectId],
          [hero.objectId, enemyHero.objectId],
        ]) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": invalid },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": targetKind === "none" ? [] : [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        const damage = targetKind === "none" ? 0 : 2;
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        p.pass();
        q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(damage + Number(!shield));
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        const previous = game.state.objects[enemyHero.objectId]!.damage;
        trigger();
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [enemyHero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[enemyHero.objectId]!.damage).toBe(previous + 2);
      });
});
