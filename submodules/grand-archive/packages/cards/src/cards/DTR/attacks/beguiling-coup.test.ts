import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { skeweringAdvance } from "./skewering-advance.ts";
import { exsanguinatingWallop } from "./exsanguinating-wallop.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { aethercloakSentinel } from "../allies/aethercloak-sentinel.ts";
import { beguilingCoup } from "./beguiling-coup.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { backdash } from "../actions/backdash.ts";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { babySlime } from "../../RDO/tokens/baby-slime.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers q1b6htzcox-a2 */
describe("Beguiling Coup - element bonus and the only cost-one omen", () => {
  for (const matching of [false, true])
    for (const position of ["omen", "unmarked", "graveyard"] as const)
      for (const other of ["none", "own-one", "own-two", "opposing-one"] as const)
        it(`${matching ? "Umbra" : "Norm"} champion, ${position}, ${other}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(
              matching ? beguilingCoup : woodlandSquirrels,
              false,
              "activation-discount",
            ),
          );
          const extra = other === "own-two" ? twoOfHearts : backdash;
          const ownExtra = other === "own-one" || other === "own-two";
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [
                  trainingSword,
                  woodlandSquirrels,
                  ...Array.from(
                    { length: Number(position === "omen") + Number(ownExtra) },
                    () => condemnedTrinket,
                  ),
                ],
                hand: Array.from({ length: 7 }, () => woodlandSquirrels),
                graveyard: [
                  ...(position !== "unmarked" ? [beguilingCoup] : []),
                  extra,
                  giantTortoise,
                ],
                banishment: [...(position === "unmarked" ? [beguilingCoup] : []), backdash],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword, ...(other === "opposing-one" ? [condemnedTrinket] : [])],
                hand: Array.from({ length: 3 }, () => woodlandSquirrels),
                graveyard: [backdash, giantTortoise],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const makeOmen = (owner: typeof p, definition: typeof backdash) => {
            const selected = owner.card(definition, { zone: "graveyard" });
            owner.activateAbility(
              owner.cards(condemnedTrinket, { zone: "field" })[0]!,
              "21oy1nd4nw-a1",
              {
                reservePayment: owner
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 3)
                  .map((c) => ({ kind: "card", cardId: c.objectId })),
              },
            );
            passEffectsStack(game);
            answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            passEffectsStack(game);
            expect(game.state.objects[selected.objectId]).toMatchObject({
              zone: "banishment",
              counters: { omen: 1 },
            });
          };
          if (other === "opposing-one") makeOmen(q, backdash);
          advanceToMain(game, p.id);
          if (position === "omen") makeOmen(p, beguilingCoup);
          if (ownExtra) makeOmen(p, extra);
          const target = q.card(champion);
          const bonus = matching && position === "omen" && other !== "own-one" ? 1 : 0;
          p.declareAttack(p.card(champion), target, {
            weaponIds: [p.card(trainingSword).objectId],
          });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1 + bonus);
          p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(2 + bonus);
          advanceToMain(game, q.id);
          q.declareAttack(q.card(champion), p.card(champion), {
            weaponIds: [q.card(trainingSword).objectId],
          });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
        });
});

/** @covers q1b6htzcox-a1 */
describe("Beguiling Coup - replace an attacking card with an omen", () => {
  for (const redirect of [false, true])
    for (const command of [false, true])
      for (const taunt of [false, true])
        for (const opposingOmen of [false, true])
          for (const matching of [false, true])
            it(`pays before replacing intent, command=${command}, redirect=${redirect}, taunt=${taunt}, opposingOmen=${opposingOmen}, class=${matching}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(beguilingCoup, matching, "activation-discount"),
              );
              const game = GrandArchiveTestEngine.startFixture({
                firstPlayer: opposingOmen ? "playerTwo" : "playerOne",
                playerOne: {
                  champion,
                  zones: {
                    field: [condemnedTrinket, enfeebledDagger, enfeebledDagger, enfeebledDagger],
                    hand: [beguilingCoup, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
                    graveyard: [
                      ...(opposingOmen ? [] : [command ? skeweringAdvance : exsanguinatingWallop]),
                      giantTortoise,
                    ],
                    "main-deck": [woodlandSquirrels, woodlandSquirrels],
                  },
                },
                playerTwo: {
                  champion,
                  zones: {
                    field: [
                      giantTortoise,
                      woodlandSquirrels,
                      condemnedTrinket,
                      ...(taunt ? [aethercloakSentinel] : []),
                    ],
                    hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                    graveyard: [
                      ...(opposingOmen ? [command ? skeweringAdvance : exsanguinatingWallop] : []),
                      giantTortoise,
                    ],
                  },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two");
              const source = p.card(beguilingCoup),
                omen = (opposingOmen ? q : p).card(
                  command ? skeweringAdvance : exsanguinatingWallop,
                );
              const payment = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              const maker = opposingOmen ? q : p;
              maker.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
                reservePayment: maker
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 3)
                  .map((c) => ({ kind: "card", cardId: c.objectId })),
              });
              passEffectsStack(game);
              answerDecision(game, "resolve-effect-choice", [omen.objectId]);
              passEffectsStack(game);
              if (opposingOmen) advanceToMain(game, p.id);
              for (const dagger of p.cards(enfeebledDagger, { zone: "field" })) {
                p.activateAbility(dagger, "idpdon8f0h-a1", {
                  targets: { "target-unit": [p.card(champion).objectId] },
                });
                passEffectsStack(game);
              }
              expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(3);
              const outside = game.state;
              expect(() =>
                p.activateAbility(source, "q1b6htzcox-a1", {
                  reservePayment: payment(2),
                  targets: { "target-attack-omen": [omen.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(outside);
              p.activate(source, {
                reservePayment: payment(1),
                attackAttackerId: p.card(champion).objectId,
              });
              passEffectsStack(game);
              const initial = q.card(taunt ? aethercloakSentinel : champion);
              const redirected = q.card(giantTortoise, { zone: "field" });
              declareResolvedAttack(
                game,
                p.card(champion).objectId,
                initial.objectId,
                "Attack with Beguiling Coup",
              );
              if (!matching) {
                const before = game.state;
                expect(() =>
                  p.activateAbility(source, "q1b6htzcox-a1", {
                    reservePayment: payment(2),
                    targets: { "target-attack-omen": [omen.objectId] },
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
                game.resolveCombatWithoutRetaliation();
                expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
                expect(game.state.objects[omen.objectId]!.zone).toBe("banishment");
                expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(3);
                if (!taunt) expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
                return;
              }
              for (const invalid of [
                [],
                [omen.objectId, omen.objectId],
                [p.card(giantTortoise).objectId],
                [source.objectId],
                [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
              ]) {
                const before = game.state;
                expect(() =>
                  p.activateAbility(source, "q1b6htzcox-a1", {
                    reservePayment: payment(2),
                    targets: { "target-attack-omen": invalid },
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              const before = game.state;
              expect(() =>
                p.activateAbility(source, "q1b6htzcox-a1", {
                  reservePayment: payment(1),
                  targets: { "target-attack-omen": [omen.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              p.activateAbility(source, "q1b6htzcox-a1", {
                reservePayment: payment(2),
                targets: { "target-attack-omen": [omen.objectId] },
              });
              expect(game.state.objects[source.objectId]).toMatchObject({
                zone: "banishment",
                counters: { omen: 1 },
              });
              expect(game.state.objects[omen.objectId]!.zone).toBe("banishment");
              passEffectsStack(game);
              answerDecision(game, "resolve-optional-effect", redirect);
              if (redirect) {
                expect(game.state.combat?.step).toBe("retaliation");
                for (const invalid of [
                  [],
                  [p.card(champion).objectId],
                  [initial.objectId],
                  [p.card(giantTortoise).objectId],
                  [redirected.objectId, q.card(woodlandSquirrels, { zone: "field" }).objectId],
                ]) {
                  const before = game.state;
                  expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                  expect(game.state).toEqual(before);
                }
                answerDecision(game, "resolve-effect-choice", [redirected.objectId]);
              }
              passEffectsStack(game);
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(command ? 3 : 0);
              expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
                redirect || taunt ? 0 : command ? 1 : 6,
              );
              if (redirect)
                expect(game.state.objects[redirected.objectId]).toMatchObject(
                  command ? { zone: "field", damage: 1 } : { zone: "graveyard" },
                );
              expect(game.state.objects[omen.objectId]!.zone).toBe("graveyard");
            });
});

/** @covers q1b6htzcox-a1 */
describe("Beguiling Coup - redirect after the original defender leaves", () => {
  for (const original of [woodlandSquirrels, babySlime])
    for (const redirect of [false, true])
      it(`keeps the attack alive and may choose a new defender after ${original.slug} leaves, redirect=${redirect}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(beguilingCoup, true, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [condemnedTrinket],
              hand: [beguilingCoup, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              graveyard: [exsanguinatingWallop, giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [original, giantTortoise, enfeebledDagger] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(beguilingCoup),
          omen = p.card(exsanguinatingWallop),
          defender = q.card(original);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: pay(3) });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [omen.objectId]);
        passEffectsStack(game);
        p.activate(source, { reservePayment: pay(1), attackAttackerId: p.card(champion).objectId });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          p.card(champion).objectId,
          defender.objectId,
          "Attack the original ally",
        );
        p.activateAbility(source, "q1b6htzcox-a1", {
          reservePayment: pay(2),
          targets: { "target-attack-omen": [omen.objectId] },
        });
        p.pass();
        q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [defender.objectId] },
        });
        passEffectsStack(game);
        if (original.definitionKind === "token-representation")
          expect(game.state.objects[defender.objectId]).toBeUndefined();
        else expect(game.state.objects[defender.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[p.card(champion).objectId]!.states.has("attacking")).toBe(true);
        answerDecision(game, "resolve-optional-effect", redirect);
        if (redirect) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [defender.objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [q.card(champion).objectId]);
        }
        passEffectsStack(game);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(redirect ? 6 : 0);
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[omen.objectId]!.zone).toBe("graveyard");
        expect(p.zone("memory")).toHaveLength(6);
      });
});
