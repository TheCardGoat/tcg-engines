import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { purgingTempest } from "./purging-tempest.ts";
import { regalInquisition } from "./regal-inquisition.ts";
import { backdash } from "./backdash.ts";
import { raisedSlash } from "../attacks/raised-slash.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { trivialTrinket } from "../../RDO/items/trivial-trinket.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
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

/** @covers yuo7dbge3b-a1 */
describe("Purging Tempest — replace the selected graveyard's non-field arrivals", () => {
  it("does not replace a mill that resolves before Tempest, then replaces later arrivals", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(purgingTempest, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [trivialTrinket, trivialTrinket],
          hand: [purgingTempest, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      deck = q.zone("main-deck");
    p.activate(purgingTempest, {
      targets: { "target-player": [q.id] },
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    p.activateAbility(p.cards(trivialTrinket, { zone: "field" })[0]!, "Nym5Y3JsO5-a1", {
      targets: { "target-player": [q.id] },
    });
    passEffectsStack(game);
    for (const [index, card] of deck.entries())
      expect(game.state.objects[card.objectId]!.zone).toBe(index < 3 ? "graveyard" : "main-deck");
    p.activateAbility(p.cards(trivialTrinket, { zone: "field" })[0]!, "Nym5Y3JsO5-a1", {
      targets: { "target-player": [q.id] },
    });
    passEffectsStack(game);
    for (const [index, card] of deck.entries())
      expect(game.state.objects[card.objectId]!.zone).toBe(index < 3 ? "graveyard" : "banishment");
  });

  for (const targetSelf of [false, true])
    it(`excludes field deaths, includes attack intent, and expires: target self=${targetSelf}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(purgingTempest, false, "activation-discount"),
      );
      const supplies = {
        field: [enfeebledDagger, woodlandSquirrels],
        hand: [
          raisedSlash,
          backdash,
          backdash,
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: targetSelf ? "playerOne" : "playerTwo",
        playerOne: { champion, zones: { ...supplies, hand: [purgingTempest, ...supplies.hand] } },
        playerTwo: { champion, zones: supplies },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = targetSelf ? p : q,
        other = targetSelf ? q : p;
      const payment = (player: typeof p, count: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, count)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (!targetSelf) q.pass();
      p.activate(purgingTempest, {
        targets: { "target-player": [target.id] },
        reservePayment: payment(p, 2),
      });
      passEffectsStack(game);
      const ally = target.card(woodlandSquirrels, { zone: "field" });
      target.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [ally.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
      const hero = target.card(champion),
        attack = target.card(raisedSlash);
      target.activate(attack, {
        attackAttackerId: hero.objectId,
        reservePayment: payment(target, 3),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        hero.objectId,
        other.card(champion).objectId,
        "Declare Raised Slash",
      );
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[other.card(champion).objectId]!.damage).toBe(3);
      expect(game.state.objects[attack.objectId]!.zone).toBe("banishment");
      const first = target.cards(backdash, { zone: "hand" })[0]!;
      target.activate(first, {
        targets: { "target-1": [hero.objectId] },
        reservePayment: payment(target, 1),
      });
      passEffectsStack(game);
      expect(game.state.objects[first.objectId]!.zone).toBe("banishment");
      advanceToMain(game, other.id);
      other.pass();
      const second = target.card(backdash, { zone: "hand" });
      target.activate(second, {
        targets: { "target-1": [hero.objectId] },
        reservePayment: payment(target, 1),
      });
      passEffectsStack(game);
      expect(game.state.objects[second.objectId]!.zone).toBe("graveyard");
    });

  for (const targetSelf of [false, true])
    for (const deckSize of [0, 2, 5])
      it(`replaces deck-to-graveyard batches: target self=${targetSelf}, deck=${deckSize}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(purgingTempest, false, "activation-discount"),
        );
        const supplies = {
          field: [trivialTrinket],
          "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { ...supplies, hand: [purgingTempest, woodlandSquirrels, woodlandSquirrels] },
          },
          playerTwo: { champion, zones: supplies },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = targetSelf ? p : q,
          actor = targetSelf ? q : p;
        const deck = target.zone("main-deck");
        p.activate(purgingTempest, {
          targets: { "target-player": [target.id] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        passEffectsStack(game);
        if (targetSelf) p.pass();
        actor.activateAbility(trivialTrinket, "Nym5Y3JsO5-a1", {
          targets: { "target-player": [target.id] },
        });
        passEffectsStack(game);
        for (const [index, card] of deck.entries())
          expect(game.state.objects[card.objectId]!.zone).toBe(
            index < 3 ? "banishment" : "main-deck",
          );
        expect(target.zone("main-deck")).toHaveLength(Math.max(0, deckSize - 3));
      });

  for (const targetSelf of [false, true])
    for (const opposingActor of [false, true])
      it(`target self=${targetSelf}, discarding actor is opponent=${opposingActor}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(purgingTempest, false, "activation-discount"),
        );
        const supplies = {
          hand: [regalInquisition, backdash, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          memory: [giantTortoise],
          graveyard: [woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        };
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposingActor ? "playerTwo" : "playerOne",
          playerOne: { champion, zones: { ...supplies, hand: [purgingTempest, ...supplies.hand] } },
          playerTwo: { champion, zones: supplies },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = targetSelf ? p : q,
          actor = opposingActor ? q : p,
          victim = opposingActor ? p : q;
        const payment = (player: typeof p, count: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, count)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        const source = p.card(purgingTempest),
          oldGrave = target.card(woodlandSquirrels, { zone: "graveyard" });
        if (opposingActor) q.pass();
        const before = game.state;
        for (const targets of [[], [p.id, q.id], [target.card(champion).objectId]]) {
          expect(() =>
            p.activate(source, {
              targets: { "target-player": targets },
              reservePayment: payment(p, 2),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, {
            targets: { "target-player": [target.id] },
            reservePayment: payment(p, 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, {
          targets: { "target-player": [target.id] },
          reservePayment: payment(p, 2),
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          targetSelf ? "banishment" : "graveyard",
        );
        const hand = victim.card(backdash, { zone: "hand" }),
          memory = victim.card(giantTortoise, { zone: "memory" });
        actor.activate(regalInquisition, {
          targets: { "target-opponent": [victim.id] },
          reservePayment: payment(actor, 2),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [hand.objectId, memory.objectId]);
        passEffectsStack(game);
        const expected = victim.id === target.id ? "banishment" : "graveyard";
        expect(game.state.objects[hand.objectId]!.zone).toBe(expected);
        expect(game.state.objects[memory.objectId]!.zone).toBe(expected);
        expect(game.state.objects[oldGrave.objectId]!.zone).toBe("graveyard");
        expect(
          actor.cards(regalInquisition, {
            zone: actor.id === target.id ? "banishment" : "graveyard",
          }),
        ).toHaveLength(1);
      });
});
