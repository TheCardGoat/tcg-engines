import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { cunningBroker } from "../cards/FTC/allies/cunning-broker.ts";
import { songOfNurturing } from "../cards/DOA/actions/song-of-nurturing.ts";
import { fledgling } from "../cards/HVN/tokens/fledgling.ts";

export function proveHarmonizeMillSummon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mill: boolean,
) {
  for (const matching of [false, true])
    for (const history of [
      "none",
      "current",
      "previous",
      "opponent",
      "non-melody",
      "response",
      ...(mill ? ["pending"] : []),
    ]) {
      it(`Harmonize checks own current-turn activation, class=${matching}, history=${history}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [fledgling],
          playerOne: {
            champion,
            zones: {
              field: [woodlandSquirrels, cunningBroker],
              hand: [card, songOfNurturing, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 8 }, () => giantTortoise),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, cunningBroker],
              hand: [songOfNurturing, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const pay = (player: typeof p, amount: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const song = (player: typeof p) =>
          player.activate(songOfNurturing, { reservePayment: pay(player, 2) });
        if (["current", "previous", "pending"].includes(history)) {
          song(p);
          if (history !== "pending") passEffectsStack(game);
        }
        if (history === "previous") advanceToMain(game, p.id, game.state.turn.number);
        if (history === "opponent") {
          p.pass();
          song(q);
          passEffectsStack(game);
        }
        if (history === "non-melody") {
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
        }
        const deck = p.zone("main-deck"),
          otherDeck = q.zone("main-deck"),
          beforeField = p.zone("field");
        const power = (id: (typeof beforeField)[number]["objectId"]) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const otherPower = power(q.card(woodlandSquirrels, { zone: "field" }).objectId);
        p.activate(card, {
          reservePayment: pay(p, mill ? 2 : 3),
          ...(mill ? { targets: { "target-1": [q.card(champion).objectId] } } : {}),
        });
        expect(p.zone("main-deck")).toEqual(deck);
        expect(p.cards(fledgling, { zone: "field" })).toHaveLength(0);
        if (history === "response") song(p);
        passEffectsStack(game);
        const active = ["current", "pending", "response"].includes(history);
        if (mill) {
          expect(p.zone("main-deck")).toEqual(active ? deck.slice(4) : deck);
          expect(p.cards(giantTortoise, { zone: "graveyard" })).toEqual(
            active ? deck.slice(0, 4) : [],
          );
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(active ? 6 : 0);
        } else {
          const tokens = p.cards(fledgling, { zone: "field" });
          expect(tokens).toHaveLength(active ? 2 : 0);
          for (const token of tokens) {
            const object = game.state.objects[token.objectId]!;
            expect(object.ownerId).toBe(p.id);
            expect(object.controllerId).toBe(p.id);
            expect(object.isToken).toBe(true);
            expect(power(token.objectId)).toBe(1);
          }
          for (const ally of p.cards(woodlandSquirrels, { zone: "field" }))
            expect(power(ally.objectId)).toBe(2 + Number(matching && active));
          expect(power(p.card(cunningBroker, { zone: "field" }).objectId)).toBe(
            Number(matching && active),
          );
          expect(power(q.card(woodlandSquirrels, { zone: "field" }).objectId)).toBe(otherPower);
          const later = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
          p.activate(later);
          passEffectsStack(game);
          expect(power(later.objectId)).toBe(1);
          advanceToMain(game, p.id, game.state.turn.number);
          for (const token of tokens) expect(power(token.objectId)).toBe(0);
          for (const ally of p.cards(woodlandSquirrels, { zone: "field" }))
            expect(power(ally.objectId)).toBe(1);
        }
        if (mill) expect(q.zone("main-deck")).toEqual(otherDeck);
      });
    }
}
