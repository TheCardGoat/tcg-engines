import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { surgingObstruction } from "../cards/RDO/actions/surging-obstruction.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveAdditionalCardMoveCost(card: Card, count: number, material = false) {
  for (const matching of [false, true])
    for (const negate of [false, true])
      it(`pays exactly ${count} cards before resolution: class=${matching}, negate=${negate}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, trainingSword],
              hand: [
                card,
                giantTortoise,
                giantTortoise,
                giantTortoise,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              memory: [giantTortoise],
              graveyard: [giantTortoise],
              "material-deck": [trainingSword, trainingSword, trainingSword],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                giantTortoise,
                surgingObstruction,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "material-deck": [trainingSword],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card, { zone: "hand" });
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const candidates = material
          ? p.cards(trainingSword, { zone: "material-deck" })
          : p.cards(giantTortoise, { zone: "hand" });
        const ids = candidates.slice(0, count).map((c) => c.objectId);
        const options = {
          reservePayment: payment,
          ...(material
            ? { targets: { "target-1": [p.card(trainingSword, { zone: "field" }).objectId] } }
            : {}),
        };
        const wrong = [
          source.objectId,
          p.card(giantTortoise, { zone: "field" }).objectId,
          p.card(giantTortoise, { zone: "graveyard" }).objectId,
          p.card(giantTortoise, { zone: "memory" }).objectId,
          material ? q.card(trainingSword).objectId : q.card(giantTortoise).objectId,
        ];
        const invalid = [
          [],
          ids.slice(1),
          candidates.map((c) => c.objectId),
          [...ids, ids[0]!],
          ...wrong.map((id) => [id, ...ids.slice(1)]),
          ...(count > 1 ? [[ids[0]!, ids[0]!]] : []),
          ...(!material ? [[payment[0]!.cardId, ...ids.slice(1)]] : []),
        ];
        for (const selection of invalid) {
          const before = game.state;
          expect(() => p.activate(source, { ...options, costSelections: [selection] })).toThrow();
          expect(game.state).toEqual(before);
        }
        const before = game.state;
        expect(() =>
          p.activate(source, {
            ...options,
            reservePayment: payment.slice(1),
            costSelections: [ids],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const hand = p.zone("hand").length,
          memory = p.zone("memory").length,
          deck = p.zone("main-deck");
        p.activate(source, { ...options, costSelections: [ids] });
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(p.zone("hand")).toHaveLength(hand - 3 - (material ? 0 : count));
        expect(p.zone("memory")).toHaveLength(memory + 2);
        for (const id of ids)
          expect(game.state.objects[id]!.zone).toBe(material ? "banishment" : "graveyard");
        if (negate) {
          const target = game.state.stack.at(-1)!.id;
          p.pass();
          q.activate(surgingObstruction, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-stack-item": [target] },
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-payment", false);
        }
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          !negate && card.slug === "plutus-fortunes-favor" ? "field" : "graveyard",
        );
        for (const id of ids)
          expect(game.state.objects[id]!.zone).toBe(material ? "banishment" : "graveyard");
        expect(p.zone("memory")).toHaveLength(memory + 2);
        expect(p.zone("main-deck")).toEqual(deck);
        expect(game.state.decision).toBeNull();
      });
}
