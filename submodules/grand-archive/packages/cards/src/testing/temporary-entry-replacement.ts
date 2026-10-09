import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { simpleSlime } from "../cards/RDO/allies/simple-slime.ts";
import { automatedGardener } from "../cards/ALC/allies/automated-gardener.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { slimecallCyclone } from "../cards/RDO/phantasias/slimecall-cyclone.ts";
import { babySlime } from "../cards/RDO/tokens/baby-slime.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
export function settleEntryReplacements(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 32; i++) {
    passEffectsStack(game);
    if (!game.state.decision) return;
    if (game.state.decision.kind !== "choose-replacement")
      throw new Error(`Unexpected ${game.state.decision.kind}`);
    answerDecision(game, "choose-replacement", game.state.decision.candidateIds[0]);
  }
  throw new Error("Entry replacements did not finish");
}
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveTemporaryEntryReplacement(card: Card, abilityId: string, slime: boolean) {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const copies of [1, 2])
        it(`modifies each qualifying entry only this turn: class=${matching}, own=${own}, copies=${copies}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const ally = slime ? simpleSlime : automatedGardener,
            cost = slime ? 2 : 3;
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            definitions: [babySlime],
            playerOne: {
              champion,
              zones: {
                field: [...Array.from({ length: copies }, () => card), ally],
                hand: [
                  ally,
                  ally,
                  ally,
                  slimecallCyclone,
                  ...Array.from({ length: 12 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [card, ally],
                hand: [
                  ally,
                  ally,
                  ally,
                  slimecallCyclone,
                  ...Array.from({ length: 12 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            recipient = own ? p : q;
          const old = [p.card(ally, { zone: "field" }), q.card(ally, { zone: "field" })];
          for (const source of p.cards(card, { zone: "field" })) {
            if (!own) q.pass();
            p.activateAbility(source, abilityId);
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
            settleEntryReplacements(game);
          }
          const pay = (n: number) =>
            recipient
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const targets = recipient.cards(ally, { zone: "hand" });
          const expectedBuff = slime && own ? copies : 0;
          for (const target of targets.slice(0, 2)) {
            recipient.activate(target, { reservePayment: pay(cost) });
            settleEntryReplacements(game);
            const object = game.state.objects[target.objectId]!;
            expect(object.zone).toBe("field");
            expect(object.counters.buff ?? 0).toBe(expectedBuff);
            expect(object.states.has("rested")).toBe(!slime);
            expect(
              deriveGrandArchiveNumericProperty(object, "life", {
                program: game.program,
                state: game.state,
                controllerId: recipient.id,
                bindings: {},
              }),
            ).toBe((slime ? 2 : 3) + expectedBuff);
          }
          const plain = recipient.cards(woodlandSquirrels, { zone: "hand" })[0]!;
          recipient.activate(plain);
          settleEntryReplacements(game);
          expect(game.state.objects[plain.objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[plain.objectId]!.states.has("rested")).toBe(false);
          if (slime) {
            recipient.activate(slimecallCyclone, { reservePayment: pay(3) });
            settleEntryReplacements(game);
            expect(
              game.state.objects[recipient.card(slimecallCyclone).objectId]!.counters.buff ?? 0,
            ).toBe(0);
          }
          for (const target of old) {
            expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
            expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
          }
          expect(q.cards(card, { zone: "field" })).toHaveLength(1);
          advanceToMain(game, recipient.id, game.state.turn.number);
          recipient.activate(targets[2]!, { reservePayment: pay(cost) });
          settleEntryReplacements(game);
          expect(game.state.objects[targets[2]!.objectId]!.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[targets[2]!.objectId]!.states.has("rested")).toBe(false);
          for (const target of targets.slice(0, 2))
            expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(expectedBuff);
        });
}
