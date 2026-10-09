import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { luciaReclaimedBlight } from "./lucia-reclaimed-blight.ts";
import { danteHemomancer } from "../champions/dante-hemomancer.ts";
import { cellforgerDroid } from "./cellforger-droid.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createLineageTestChampion,
  lineageTestChampion,
} from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers fIQR28QmYg-a2 */
describe("Lucia — champion activated ability discount", () => {
  for (const matching of [false, true])
    for (const present of [false, true])
      for (const x of [1, 2, 3, 4])
        it(`discounts only its controller's Dante ability, matching=${matching}, present=${present}, X=${x}`, () => {
          // A blank named champion carries Dante's reserve-and-rest ability to isolate Lucia's name gate.
          const base = enableAllTestElements(
            createLineageTestChampion(luciaReclaimedBlight, matching ? "Dante" : "Other"),
          );
          const champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: {
                ...requireSingleFace(base),
                abilities: [
                  ...requireSingleFace(base).abilities,
                  requireSingleFace(danteHemomancer).abilities[2]!,
                ],
              },
            },
          };
          const opponent = lineageTestChampion("Opponent", 0),
            cost = matching && present ? Math.max(0, x - 2) : x;
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [powercell],
            playerOne: {
              champion,
              zones: {
                field: [cellforgerDroid, ...(present ? [luciaReclaimedBlight] : [])],
                graveyard: present ? [] : [luciaReclaimedBlight],
                hand: [fireball, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
              },
            },
            playerTwo: { champion: opponent, zones: { field: [luciaReclaimedBlight] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(opponent);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state;
          if (cost) {
            expect(() =>
              p.activateAbility(hero, "4FtNBFaOJp-a3", {
                variables: { X: x },
                reservePayment: pay(cost - 1),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activateAbility(hero, "4FtNBFaOJp-a3", {
            variables: { X: x },
            reservePayment: pay(cost),
          });
          expect(p.zone("memory")).toHaveLength(cost);
          expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(x);
          const after = game.state;
          expect(() =>
            p.activateAbility(hero, "4FtNBFaOJp-a3", {
              variables: { X: x },
              reservePayment: pay(cost),
            }),
          ).toThrow();
          expect(game.state).toEqual(after);
          expect(() =>
            p.activate(fireball, {
              reservePayment: pay(1),
              targets: { "target-1": [foe.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(after);
          p.activate(fireball, { reservePayment: pay(2), targets: { "target-1": [foe.objectId] } });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(1 + x);
          const beforeAlly = game.state;
          expect(() =>
            p.activateAbility(cellforgerDroid, "wgX472k6J7-a2", { reservePayment: pay(2) }),
          ).toThrow();
          expect(game.state).toEqual(beforeAlly);
          p.activateAbility(cellforgerDroid, "wgX472k6J7-a2", { reservePayment: pay(4) });
          passEffectsStack(game);
          expect(p.cards(powercell, { zone: "field" })).toHaveLength(1);
        });
});

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { blissfulCalling } from "../../DOA/actions/blissful-calling.ts";
import { answerDecision } from "../../../testing/decisions.ts";
/** @covers fIQR28QmYg-a3 */
describe("Lucia — Class Bonus entry search", () => {
  for (const matching of [false, true])
    for (const size of [2, 6, 7])
      for (const take of [false, true])
        it(`looks at up to six and returns the remainder: class=${matching}, size=${size}, take=${take}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(luciaReclaimedBlight, matching, "activation-discount"),
          );
          const contents = [
            fireball,
            blissfulCalling,
            ...Array.from({ length: Math.max(0, size - 3) }, () => woodlandSquirrels),
            ...(size >= 3 ? [fireball] : []),
          ];
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [luciaReclaimedBlight, woodlandSquirrels, woodlandSquirrels],
                "main-deck": contents,
              },
            },
            playerTwo: { champion, zones: { "main-deck": [fireball] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            deck = p.zone("main-deck"),
            looked = deck.slice(0, 6),
            selected = take
              ? looked.find((ref) => ref.definitionId === fireball.canonicalId)
              : undefined;
          p.activate(luciaReclaimedBlight, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
          passEffectsStack(game);
          if (!matching) {
            expect(game.state.decision).toBeNull();
            expect(p.zone("main-deck")).toEqual(deck);
            expect(p.zone("memory")).toHaveLength(2);
            return;
          }
          if (take && !selected) throw new Error("Expected a Spell in the looked-at cards");
          const before = game.state;
          for (const ref of [
            ...looked.filter((ref) => ref.definitionId !== fireball.canonicalId),
            q.zone("main-deck")[0]!,
            ...deck.slice(6),
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [ref.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", selected ? [selected.objectId] : []);
          passEffectsStack(game);
          const rest = looked
            .filter((ref) => ref.objectId !== selected?.objectId)
            .reverse()
            .map((ref) => ref.objectId);
          if (rest.length > 1) answerDecision(game, "resolve-effect-choice", rest);
          passEffectsStack(game);
          expect(p.zone("main-deck").map((ref) => ref.objectId)).toEqual([
            ...deck.slice(6).map((ref) => ref.objectId),
            ...rest,
          ]);
          expect(p.zone("memory")).toHaveLength(2 + (take ? 1 : 0));
          if (selected)
            expect(p.cards(fireball, { zone: "memory" }).map((ref) => ref.objectId)).toEqual([
              selected.objectId,
            ]);
          const reveals = game.state.eventHistory.filter((event) => event.type === "card-revealed");
          expect(reveals).toHaveLength(take ? 1 : 0);
          for (const event of reveals)
            if (event.type === "card-revealed") expect(event.objectId).toBe(selected?.objectId);
        });
});

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
/** @covers fIQR28QmYg-a1 */
describe("Lucia, Reclaimed Blight — printed keywords", () => {
  proveKeywordGroup({
    card: luciaReclaimedBlight,
    keywords: [
      {
        name: "elysian-aura",
      },
      {
        name: "stealth",
      },
    ],
  });
});
