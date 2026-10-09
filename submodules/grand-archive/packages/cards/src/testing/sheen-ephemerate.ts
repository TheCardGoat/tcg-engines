import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { fracturedMemories } from "../cards/P25/masteries/fractured-memories.ts";
import { merlinMemoriteVassal } from "../cards/PTM/champions/merlin-memorite-vassal.ts";
import { rainwovenCrysalis } from "../cards/PTM/actions/rainwoven-crysalis.ts";
import { moltenEcho } from "../cards/PTM/actions/molten-echo.ts";
import { innervateKnowledge } from "../cards/PRD/actions/innervate-knowledge.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
function settle(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 32; i++) {
    passEffectsStack(game);
    const d = game.state.decision;
    if (d?.kind === "choose-replacement") answerDecision(game, d.kind, d.candidateIds[0]);
    else return;
  }
  throw new Error("Replacement loop");
}
export function proveSheenEphemerate(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
  cost: number,
  damage: boolean,
) {
  for (const named of [false, true])
    for (const sheen of [0, threshold - 1, threshold, threshold + 1])
      it(`Merlin retained=${named}, mastery sheen=${sheen}`, () => {
        const starter = enableAllTestElements(lineageTestChampion(named ? "Merlin" : "Other", 0)),
          merlin = enableAllTestElements(merlinMemoriteVassal),
          foe = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [fracturedMemories],
          phase: "materialize",
          playerOne: {
            champion: starter,
            zones: {
              "material-deck": [merlin],
              memory: [woodlandSquirrels],
              field: [giantTortoise],
              hand: [
                card,
                innervateKnowledge,
                sparkAlight,
                sparkAlight,
                sparkAlight,
                fireball,
                fireball,
                ...Array.from({ length: Math.floor(sheen / 2) }, () => rainwovenCrysalis),
                ...(sheen % 2 ? [moltenEcho] : []),
                ...Array.from({ length: 40 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion: foe },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          target = q.card(foe),
          source = p.card(card),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.materialize(merlin);
        settle(game);
        answerDecision(game, "resolve-optional-effect", false);
        settle(game);
        advanceToMain(game, p.id);
        p.activate(source, {
          reservePayment: pay(damage ? 2 : 1),
          targets: { "target-1": [damage ? target.objectId : p.card(giantTortoise).objectId] },
        });
        settle(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        for (const rain of p.cards(rainwovenCrysalis, { zone: "hand" })) {
          p.activate(rain, { reservePayment: pay(2) });
          settle(game);
        }
        if (sheen % 2) {
          p.activate(moltenEcho, {
            reservePayment: pay(2),
            targets: { "target-1": [target.objectId] },
          });
          settle(game);
        }
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(sheen);
        if (!named) {
          for (const spark of p.cards(sparkAlight, { zone: "hand" })) {
            p.activate(spark, { reservePayment: pay(2), targets: { "target-1": [hero.objectId] } });
            settle(game);
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(6);
          p.activate(innervateKnowledge, { reservePayment: pay(4) });
          settle(game);
          expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(sheen);
          expect(p.card(merlin, { zone: "material-deck" })).toBeDefined();
        }
        const activate = (n: number, ephemerate = true) =>
          p.activate(source, {
            ...(ephemerate ? { activationMethod: "ephemerate" as const } : {}),
            reservePayment: pay(n),
            targets: { "target-1": [target.objectId] },
          });
        const before = game.state;
        if (!named || sheen < threshold) {
          expect(() => activate(cost)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        for (const n of [cost - 1, cost + 1]) {
          expect(() => activate(n)).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() => activate(cost, false)).toThrow();
        expect(game.state).toEqual(before);
        const prior = game.state.objects[target.objectId]!.damage,
          memory = p.zone("memory").length;
        activate(cost);
        expect(p.zone("memory")).toHaveLength(memory + cost);
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(true);
        settle(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(false);
        if (damage) expect(game.state.objects[target.objectId]!.damage).toBe(prior + 4);
        else {
          for (let i = 0; i < 2; i++) {
            p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
              reservePayment: pay(4),
              targets: { "target-1": [target.objectId] },
            });
            settle(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(prior + (i === 0 ? 0 : 2));
          }
        }
      });
}
