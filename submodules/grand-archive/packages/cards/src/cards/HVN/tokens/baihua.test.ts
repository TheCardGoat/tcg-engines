import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { baihua } from "./baihua.ts";
import { flowerbud } from "./flowerbud.ts";
import { lycoria } from "./lycoria.ts";
import { fullBloom } from "../../RDO/phantasias/full-bloom.ts";
import { bloomSummersGlow } from "../../P25/actions/bloom-summers-glow.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfKanaloa } from "../../PP1/boons/greater-boon-of-kanaloa.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";

/** @covers i59eamoov0-a1 */
describe("Baihua recovers each opponent", () => {
  for (const damage of [1, 5])
    it(`four summoned tokens recover both opponents, damage=${damage}`, () => {
      const base = enableAllTestElements(lineageTestChampion("Diao Chan", 0));
      const face = requireSingleFace(base);
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...face,
            stats: { ...face.stats, power: 6 },
            typeLine: {
              ...face.typeLine,
              classes: ["CLERIC"] as const,
              subtypes: ["CLERIC"] as const,
            },
          },
        },
      };
      const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [
          { definitionId: woodlandSquirrels.canonicalId, count: 30 },
          { definitionId: singeingLeap.canonicalId, count: 20 },
          ...(id === "player-one"
            ? [
                { definitionId: fullBloom.canonicalId, count: 10 },
                { definitionId: bloomSummersGlow.canonicalId, count: 10 },
              ]
            : []),
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfKanaloa.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const start = (seed: number) =>
        GrandArchiveTestEngine.start(
          [
            champion,
            woodlandSquirrels,
            singeingLeap,
            fullBloom,
            bloomSummersGlow,
            flowerbud,
            lycoria,
            baihua,
            lesserBoonOfApollo,
            greaterBoonOfKanaloa,
            pantheonBarrier,
          ],
          {
            mode: "pantheon",
            firstPlayerId: "player-one",
            randomSeed: seed,
            players: [setup("player-one"), setup("player-two"), setup("player-three")],
          },
          { validateDeckConstruction: false, skipPregameForTests: true },
        );
      let game = start(1);
      let found = false;
      for (let seed = 1; seed <= 100; seed++) {
        game = start(seed);
        const player = game.player("player-one");
        const draws = [...player.zone("hand"), ...player.zone("main-deck").slice(0, 18)];
        const count = (id: string) => draws.filter((ref) => ref.definitionId === id).length;
        if (
          count(fullBloom.canonicalId) > 0 &&
          count(bloomSummersGlow.canonicalId) > 0 &&
          count(singeingLeap.canonicalId) >= 5 &&
          count(woodlandSquirrels.canonicalId) >= 7
        ) {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
      const p = game.player("player-one"),
        q = game.player("player-two"),
        r = game.player("player-three");
      for (let i = 0; i < 18; i++) advanceToMain(game, p.id, game.state.turn.number);
      const pay = (player: typeof p, n: number, exclude: string) =>
        player
          .zone("hand")
          .filter(
            (ref) => ref.objectId !== exclude && ref.definitionId === woodlandSquirrels.canonicalId,
          )
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const bloom = p.cards(fullBloom, { zone: "hand" })[0]!;
      p.activate(bloom, { reservePayment: pay(p, 7, bloom.objectId) });
      passEffectsStack(game);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-opponent": [q.id] },
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "order-triggered-abilities")
        answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
      passEffectsStack(game);
      expect(q.cards(flowerbud, { zone: "field" })).toHaveLength(4);
      expect(q.cards(pantheonBarrier, { zone: "field" })).toHaveLength(0);
      advanceToMain(game, p.id, game.state.turn.number);
      const summer = p.cards(bloomSummersGlow, { zone: "hand" })[0]!;
      p.activate(summer, { reservePayment: pay(p, 2, summer.objectId) });
      passEffectsStack(game);
      for (let i = 0; i < 4; i++) {
        answerDecision(game, "resolve-effect-choice", "Baihua");
        passEffectsStack(game);
      }
      const flowers = q.cards(baihua, { zone: "field" });
      expect(flowers).toHaveLength(4);
      for (const token of flowers)
        expect(game.state.objects[token.objectId]).toMatchObject({
          ownerId: q.id,
          controllerId: q.id,
          isToken: true,
        });
      const hurt = (player: typeof p, n: number) => {
        for (let i = 0; i < n; i++) {
          const source = player.cards(singeingLeap, { zone: "hand" })[0]!;
          player.activate(source, { reservePayment: pay(player, 1, source.objectId) });
          passEffectsStack(game);
        }
      };
      advanceToMain(game, q.id, -1, true);
      q.declareAttack(q.card(champion), r.card(pantheonBarrier, { zone: "field" }));
      game.resolveCombatWithoutRetaliation();
      hurt(q, 1);
      advanceToMain(game, r.id);
      r.declareAttack(r.card(champion), p.card(pantheonBarrier, { zone: "field" }));
      game.resolveCombatWithoutRetaliation();
      hurt(r, damage);
      advanceToMain(game, p.id);
      hurt(p, damage);
      const ph = p.card(champion),
        qh = q.card(champion),
        rh = r.card(champion);
      expect(game.state.objects[qh.objectId]!.damage).toBe(3);
      for (let tick = 0; tick < 2; tick++) {
        advanceToRecollection(game, q.id);
        expect(game.state.objects[ph.objectId]!.damage).toBe(Math.max(0, damage - 4 * tick));
        expect(game.state.objects[rh.objectId]!.damage).toBe(Math.max(0, damage - 4 * tick));
        const decision = game.state.decision;
        if (decision?.kind !== "order-triggered-abilities")
          throw new Error(`Expected four Baihua triggers, got ${decision?.kind}`);
        expect(decision.pendingTriggerIds).toHaveLength(4);
        answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
        expect(game.state.stack).toHaveLength(4);
        expect(game.state.stack.map((item) => item.sourceId).sort()).toEqual(
          flowers.map((ref) => ref.objectId).sort(),
        );
        for (let resolved = 1; resolved <= 4; resolved++) {
          for (let step = 0; step < 8 && game.state.stack.length === 5 - resolved; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity")
              throw new Error(`Unexpected ${wait.kind} while resolving Baihua`);
            game.player(wait.playerId).pass();
          }
          expect(game.state.stack).toHaveLength(4 - resolved);
          expect(game.state.objects[ph.objectId]!.damage).toBe(
            Math.max(0, damage - 4 * tick - resolved),
          );
          expect(game.state.objects[rh.objectId]!.damage).toBe(
            Math.max(0, damage - 4 * tick - resolved),
          );
          expect(game.state.objects[qh.objectId]!.damage).toBe(3);
        }
        expect(game.state.objects[ph.objectId]!.damage).toBe(Math.max(0, damage - 4 * (tick + 1)));
        expect(game.state.objects[rh.objectId]!.damage).toBe(Math.max(0, damage - 4 * (tick + 1)));
        expect(game.state.objects[qh.objectId]!.damage).toBe(3);
        for (const other of [r, p]) {
          advanceToRecollection(game, other.id);
          expect(game.state.stack).toHaveLength(0);
        }
      }
    });
});
