import { describe } from "vitest";
import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { raiManaWeaver } from "./rai-mana-weaver.ts";

/** @covers 6ILtLfjQEe-a1 */
describe("Rai, Mana Weaver \u2014 6ILtLfjQEe-a1", () => {
  proveChampionLineage({ card: raiManaWeaver, lineageName: "Rai", level: 3, memoryCost: 3 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { fireball } from "../actions/fireball.ts";
import { idleThoughts } from "../actions/idle-thoughts.ts";
import { invokeDominance } from "../actions/invoke-dominance.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
/** @covers 6ILtLfjQEe-a2 */
describe("Rai Mana Weaver pays rest and four enlighten to copy a Mage Spell activation", () => {
  for (const retarget of [false, true])
    for (const counters of [4, 5])
      it(`retarget=${retarget}, counters=${counters}`, () => {
        const starter = lineageTestChampion("Rai", 0),
          opponent = grantTestChampionLevel(
            createClassBonusTestChampion(fireball, true, "activation-discount"),
            1,
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage: [
                lineageTestChampion("Rai", 1),
                lineageTestChampion("Rai", 2),
                raiManaWeaver,
              ],
              zones: { field: Array.from({ length: counters }, () => jewelOfEnlightenment) },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                field: [jewelOfEnlightenment],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          foe = q.card(opponent),
          jewels = p.cards(jewelOfEnlightenment);
        for (const jewel of jewels.slice(0, 3)) {
          p.activateAbility(jewel, "AKA19OwaCh-a1");
          passEffectsStack(game);
        }
        p.pass();
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [hero.objectId] },
        });
        const original = game.state.stack.at(-1)!;
        q.pass();
        const before = game.state;
        expect(() =>
          p.activateAbility(hero, "6ILtLfjQEe-a2", {
            targets: { "target-card-activation": [original.id] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        for (const jewel of jewels.slice(3)) {
          p.activateAbility(jewel, "AKA19OwaCh-a1");
          while (game.state.stack.length > 1) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        const funded = game.state;
        expect(() =>
          p.activateAbility(hero, "6ILtLfjQEe-a2", {
            targets: { "target-card-activation": [q.card(jewelOfEnlightenment).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(funded);
        p.activateAbility(hero, "6ILtLfjQEe-a2", {
          targets: { "target-card-activation": [original.id] },
        });
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(counters - 4);
        expect(p.zone("memory")).toHaveLength(0);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", retarget);
        if (retarget) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "retarget-stack-item", {
              targets: { "target-1": [q.card(jewelOfEnlightenment).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "retarget-stack-item", { targets: { "target-1": [foe.objectId] } });
        }
        const copy = game.state.stack.at(-1)!;
        expect(copy).toMatchObject({ kind: "card-activation", isCopy: true, controllerId: p.id });
        expect(game.state.stack.find((item) => item.id === original.id)?.targets).toEqual(
          original.targets,
        );
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(retarget ? 2 : 6);
        expect(game.state.objects[foe.objectId]!.damage).toBe(retarget ? 4 : 0);
        expect(q.card(fireball, { zone: "graveyard" })).toBeDefined();
        expect(q.zone("memory")).toHaveLength(2);
        expect(p.zone("memory")).toHaveLength(0);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(counters - 4);
      });
  for (const sourceCard of [idleThoughts, invokeDominance, woodlandSquirrels])
    it(`cannot copy ${sourceCard.slug}`, () => {
      const starter = lineageTestChampion("Rai", 0),
        base = createClassBonusTestChampion(fireball, true, "activation-discount"),
        champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), elements: ["FIRE" as const, "TERA" as const] },
          },
        },
        game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Rai", 1), lineageTestChampion("Rai", 2), raiManaWeaver],
            zones: { field: Array.from({ length: 4 }, () => jewelOfEnlightenment) },
          },
          playerTwo: {
            champion,
            zones: { hand: [sourceCard, idleThoughts, fireball], "main-deck": [woodlandSquirrels] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter);
      for (const jewel of p.cards(jewelOfEnlightenment)) {
        q.pass();
        p.activateAbility(jewel, "AKA19OwaCh-a1");
        passEffectsStack(game);
      }
      const chosen = q.cards(sourceCard, { zone: "hand" })[0]!,
        payment = q.card(fireball, { zone: "hand" });
      q.activate(chosen, {
        reservePayment:
          sourceCard.canonicalId === woodlandSquirrels.canonicalId
            ? []
            : [{ kind: "card", cardId: payment.objectId }],
      });
      const activation = game.state.stack.at(-1)!;
      q.pass();
      const before = game.state;
      expect(() =>
        p.activateAbility(hero, "6ILtLfjQEe-a2", {
          targets: { "target-card-activation": [activation.id] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(game.state.objects[hero.objectId]!.counters.enlighten).toBe(4);
      expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
    });
});
