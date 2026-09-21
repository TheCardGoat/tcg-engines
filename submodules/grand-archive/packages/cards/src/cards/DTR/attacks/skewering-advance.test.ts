import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { skeweringAdvance } from "./skewering-advance.ts";
import { snowWhiteWeissQueen } from "../allies/snow-white-weiss-queen.ts";
import { spirelleSchwartzQueen } from "../allies/spirelle-schwartz-queen.ts";
import { hornedKnight } from "../allies/horned-knight.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSession } from "../../DOA/actions/training-session.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers no5tu5412v-a1 */
describe("Skewering Advance - Command Chessman", () => {
  for (const matching of [false, true])
    for (const scenario of ["normal", "rested", "removed"] as const)
      it(`matching class=${matching}, ${scenario}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(skeweringAdvance, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [skeweringAdvance, snowWhiteWeissQueen, woodlandSquirrels, woodlandSquirrels],
              field: [snowWhiteWeissQueen, woodlandSquirrels],
              graveyard: [snowWhiteWeissQueen],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [snowWhiteWeissQueen, enfeebledDagger] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          attacker = p.card(snowWhiteWeissQueen, { zone: "field" }),
          source = p.card(skeweringAdvance),
          target = q.card(champion);
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        for (const invalid of [
          p.card(champion),
          p.card(woodlandSquirrels, { zone: "field" }),
          p.card(snowWhiteWeissQueen, { zone: "hand" }),
          p.card(snowWhiteWeissQueen, { zone: "graveyard" }),
          q.card(snowWhiteWeissQueen),
        ]) {
          expect(() =>
            p.activate(source, { reservePayment, attackAttackerId: invalid.objectId }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, {
            reservePayment: reservePayment.slice(0, 1),
            attackAttackerId: attacker.objectId,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (scenario === "rested") {
          p.declareAttack(attacker, target);
          game.resolveCombatWithoutRetaliation();
          const rested = game.state;
          expect(() =>
            p.activate(source, { reservePayment, attackAttackerId: attacker.objectId }),
          ).toThrow();
          expect(game.state).toEqual(rested);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          return;
        }
        p.activate(source, { reservePayment, attackAttackerId: attacker.objectId });
        expect(p.zone("memory")).toHaveLength(2);
        expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[p.card(champion).objectId]!.states.has("rested")).toBe(false);
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        if (scenario === "removed") {
          p.pass();
          q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
            targets: { "target-unit": [attacker.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[attacker.objectId]!.zone).toBe("graveyard");
          expect(game.state.combat).toBeFalsy();
          expect(game.state.decision).toBeFalsy();
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
        } else {
          passEffectsStack(game);
          declareResolvedAttack(
            game,
            attacker.objectId,
            target.objectId,
            "Command with Skewering Advance",
          );
          expect(game.state.combat?.attackerId).toBe(attacker.objectId);
          expect(game.state.objects[source.objectId]!.zone).toBe("intent");
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("main-deck")).toHaveLength(1);
      });
  it("allows an awake zero-power Chessman to perform the Command", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(skeweringAdvance, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [spirelleSchwartzQueen],
          hand: [skeweringAdvance, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      attacker = p.card(spirelleSchwartzQueen),
      target = q.card(champion);
    const before = game.state;
    expect(() => p.declareAttack(attacker, target)).toThrow();
    expect(game.state).toEqual(before);
    p.activate(skeweringAdvance, {
      reservePayment: p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      attackAttackerId: attacker.objectId,
    });
    passEffectsStack(game);
    declareResolvedAttack(game, attacker.objectId, target.objectId, "Zero-power Chessman Command");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[p.card(champion).objectId]!.states.has("rested")).toBe(false);
  });
});

/** @covers no5tu5412v-a2 */
describe("Skewering Advance - killed unit current-life parity", () => {
  for (const targetCard of [woodlandSquirrels, hornedKnight, giantTortoise])
    for (const buff of [false, true])
      it(`${targetCard.slug}, buff=${buff}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(skeweringAdvance, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [skeweringAdvance, woodlandSquirrels, woodlandSquirrels],
              field: [snowWhiteWeissQueen],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [targetCard],
              hand: [trainingSession, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = q.card(targetCard, { zone: "field" }),
          attacker = p.card(snowWhiteWeissQueen);
        if (buff) {
          q.activate(trainingSession, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
        }
        advanceToMain(game, p.id);
        const deck = p.zone("main-deck").length,
          hand = p.zone("hand").length;
        p.activate(skeweringAdvance, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          attackAttackerId: attacker.objectId,
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          attacker.objectId,
          target.objectId,
          "Skewering Advance against a parity target",
        );
        expect(p.zone("main-deck")).toHaveLength(deck);
        game.resolveCombatWithoutRetaliation();
        const life =
          (targetCard === woodlandSquirrels ? 1 : targetCard === hornedKnight ? 2 : 6) +
          (buff ? 1 : 0);
        const killed = life <= 3,
          draws = killed && life % 2 === 0 ? 1 : 0;
        expect(game.state.objects[target.objectId]!.zone).toBe(killed ? "graveyard" : "field");
        expect(p.zone("main-deck")).toHaveLength(deck - draws);
        expect(p.zone("hand")).toHaveLength(hand - 3 + draws);
        expect(p.cards(skeweringAdvance, { zone: "graveyard" })).toHaveLength(1);
      });
  it("does not draw when the defender dies to noncombat damage before the attack hits", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(skeweringAdvance, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [snowWhiteWeissQueen],
          hand: [skeweringAdvance, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [hornedKnight, enfeebledDagger, enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      attacker = p.card(snowWhiteWeissQueen),
      target = q.card(hornedKnight);
    p.activate(skeweringAdvance, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      attackAttackerId: attacker.objectId,
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      attacker.objectId,
      target.objectId,
      "Command before noncombat kill",
    );
    p.pass();
    for (const dagger of q.cards(enfeebledDagger))
      q.activateAbility(dagger, "idpdon8f0h-a1", { targets: { "target-unit": [target.objectId] } });
    passEffectsStack(game);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
    expect(p.zone("main-deck")).toHaveLength(1);
    expect(p.zone("hand")).toHaveLength(0);
    expect(p.cards(skeweringAdvance, { zone: "graveyard" })).toHaveLength(1);
  });
});
