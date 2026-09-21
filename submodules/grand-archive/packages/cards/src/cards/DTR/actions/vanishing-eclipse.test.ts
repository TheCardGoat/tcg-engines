import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { vanishingEclipse } from "./vanishing-eclipse.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { strategicPlanning } from "../../DOA/actions/strategic-planning.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
const astra = enableAllTestElements(
  createClassBonusTestChampion(vanishingEclipse, false, "activation-discount"),
);
const norm = enableAllTestElements(
  createClassBonusTestChampion(strategicPlanning, false, "activation-discount"),
);

/** @covers gamylrj1fc-a1 */
describe("Vanishing Eclipse — element-gated optional Aethercalling during Glimpse", () => {
  for (const matching of [false, true])
    for (const host of [false, true])
      for (const load of [false, true])
        it(`element matching ${matching}, owned host ${host}, load requested ${load}`, () => {
          const champion = matching ? astra : norm;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [strategicPlanning, woodlandSquirrels, woodlandSquirrels, vanishingEclipse],
                field: [...(host ? [trivariateDream] : []), trainingSword],
                graveyard: [trivariateDream, vanishingEclipse],
                "main-deck": [vanishingEclipse, woodlandSquirrels, vanishingEclipse],
              },
            },
            playerTwo: {
              champion: astra,
              zones: { field: [trivariateDream], "main-deck": [vanishingEclipse] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const [eclipse, filler, unseen] = p.zone("main-deck");
          if (!eclipse || !filler || !unseen) throw new Error("Expected three deck cards");
          expect(eclipse.definitionId).toBe(vanishingEclipse.canonicalId);
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          p.activate(p.card(strategicPlanning), { reservePayment: payment });
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-glimpse",
            playerId: p.id,
            cardIds: [eclipse.objectId, filler.objectId],
          });
          expect(game.state.objects[eclipse.objectId]!.zone).toBe("main-deck");
          const weapon = host ? p.card(trivariateDream, { zone: "field" }) : p.card(trainingSword);
          const before = game.state;
          const badLoads = [
            { cardId: eclipse.objectId, weaponId: q.card(trivariateDream).objectId },
            { cardId: eclipse.objectId, weaponId: p.card(trainingSword).objectId },
            {
              cardId: eclipse.objectId,
              weaponId: p.card(trivariateDream, { zone: "graveyard" }).objectId,
            },
            { cardId: unseen.objectId, weaponId: weapon.objectId },
            {
              cardId: p.card(vanishingEclipse, { zone: "hand" }).objectId,
              weaponId: weapon.objectId,
            },
            {
              cardId: p.card(vanishingEclipse, { zone: "graveyard" }).objectId,
              weaponId: weapon.objectId,
            },
            {
              cardId: q.card(vanishingEclipse, { zone: "main-deck" }).objectId,
              weaponId: weapon.objectId,
            },
          ];
          for (const attempt of badLoads) {
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                loads: [attempt],
                top: [filler.objectId],
                bottom: attempt.cardId === eclipse.objectId ? [] : [eclipse.objectId],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const answer = {
            kind: "reorder",
            loads: [{ cardId: eclipse.objectId, weaponId: weapon.objectId }],
            top: [filler.objectId],
            bottom: [],
          };
          if (load && matching && host) {
            answerDecision(game, "resolve-glimpse", answer);
            expect(game.state.objects[eclipse.objectId]).toMatchObject({
              zone: "loaded",
              hostId: weapon.objectId,
              ownerId: p.id,
            });
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
              filler.objectId,
              unseen.objectId,
            ]);
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.objects[p.card(champion).objectId]!.counters.preparation).toBe(1);
            p.declareAttack(p.card(champion), q.card(astra), { weaponIds: [weapon.objectId] });
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(astra).objectId]!.damage).toBe(3);
            expect(game.state.objects[eclipse.objectId]!.zone).toBe("graveyard");
          } else {
            if (load) {
              expect(() => answerDecision(game, "resolve-glimpse", answer)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: [filler.objectId],
              bottom: [eclipse.objectId],
            });
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
              filler.objectId,
              unseen.objectId,
              eclipse.objectId,
            ]);
            expect(p.zone("loaded")).toHaveLength(0);
          }
          expect(game.state.objects[unseen.objectId]!.zone).toBe("main-deck");
          expect(q.zone("loaded")).toHaveLength(0);
          expect(p.zone("memory")).toHaveLength(2);
        });
});

/** @covers gamylrj1fc-a2 */
describe("Vanishing Eclipse — return an ally and become distant", () => {
  for (const own of [false, true])
    for (const opposingTurn of [false, true])
      for (const elementBonus of [false, true])
        it(`returns ${own ? "own" : "opposing"} ally on ${opposingTurn ? "opposing" : "own"} turn and expires at its controller's end, element bonus ${elementBonus}`, () => {
          const champion = elementBonus ? astra : norm;
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                hand: [vanishingEclipse, woodlandSquirrels, woodlandSquirrels],
                field: [woodlandSquirrels, trainingSword],
                graveyard: [woodlandSquirrels],
                "main-deck": [strategicPlanning, strategicPlanning],
              },
            },
            playerTwo: {
              champion: norm,
              zones: {
                field: [woodlandSquirrels],
                "main-deck": [strategicPlanning, strategicPlanning],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          if (opposingTurn) q.pass();
          const source = p.card(vanishingEclipse),
            target = owner.card(woodlandSquirrels, { zone: "field" });
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const deck = owner.zone("main-deck").map((c) => c.objectId),
            before = game.state;
          for (const invalid of [
            p.card(champion),
            q.card(norm),
            p.card(trainingSword),
            p.card(woodlandSquirrels, { zone: "graveyard" }),
            p.cards(woodlandSquirrels, { zone: "hand" })[0]!,
          ]) {
            expect(() =>
              p.activate(source, {
                reservePayment: payment,
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(source, {
              reservePayment: payment.slice(0, 1),
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, {
            reservePayment: payment,
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.zone).toBe("field");
          expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(false);
          passEffectsStack(game);
          expect(owner.zone("main-deck").map((c) => c.objectId)).toEqual([
            target.objectId,
            ...deck,
          ]);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(2);
          expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[q.card(norm).objectId]!.states.has("distant")).toBe(false);
          const turn = game.state.turn.number;
          advanceToMain(game, opposingTurn ? p.id : q.id, turn);
          expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(
            opposingTurn,
          );
          advanceToMain(game, opposingTurn ? q.id : p.id, game.state.turn.number);
          expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(false);
          expect(game.state.objects[target.objectId]!.zone).toBe("hand");
        });
  it("keeps its paid cost but does not become distant if its only target disappears", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: astra,
        zones: { hand: [vanishingEclipse, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion: norm, zones: { field: [woodlandSquirrels, enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(woodlandSquirrels);
    const source = p.card(vanishingEclipse);
    p.activate(source, {
      reservePayment: p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    p.pass();
    q.activateAbility(q.card(enfeebledDagger), "idpdon8f0h-a1", {
      targets: { "target-unit": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    expect(p.zone("memory")).toHaveLength(2);
    expect(q.zone("main-deck")).toHaveLength(0);
    expect(game.state.objects[p.card(astra).objectId]!.states.has("distant")).toBe(false);
  });
});
