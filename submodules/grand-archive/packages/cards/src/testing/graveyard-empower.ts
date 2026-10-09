import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { favorableWinds } from "../cards/DOA/actions/favorable-winds.ts";
import { impassionedTutor } from "../cards/DOA/allies/impassioned-tutor.ts";
import { combustiblePotion } from "../cards/RDO/items/combustible-potion.ts";
import { singeingLeap } from "../cards/PTM/actions/singeing-leap.ts";
import { songOfNurturing } from "../cards/DOA/actions/song-of-nurturing.ts";

export function proveGraveyardEmpower(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  base: number,
  harmonize: boolean,
) {
  for (const matching of [false, true])
    for (const count of [0, 1, 3])
      for (const expired of [false, true])
        for (const history of harmonize ? ["none", "own", "opponent", "previous"] : ["none"])
          for (const empty of count === 0 && history === "none" ? [false, true] : [false])
            it(`empty=${empty}, class=${matching}, banish=${count}, expired=${expired}, Melody=${history}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(card, matching, "activation-discount"),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      card,
                      singeingLeap,
                      songOfNurturing,
                      fireball,
                      fireball,
                      ...Array.from({ length: 18 }, () => woodlandSquirrels),
                    ],
                    graveyard: [
                      ...(empty ? [] : [fireball, impassionedTutor, combustiblePotion]),
                      favorableWinds,
                    ],
                    "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                  },
                },
                playerTwo: {
                  champion,
                  zones: {
                    hand: [songOfNurturing, woodlandSquirrels, woodlandSquirrels],
                    graveyard: [fireball],
                    "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                  },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                hero = p.card(champion),
                foe = q.card(champion);
              const pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              if (history === "opponent") {
                p.pass();
                q.activate(songOfNurturing, {
                  reservePayment: q
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                });
                passEffectsStack(game);
              } else if (history !== "none") {
                p.activate(songOfNurturing, { reservePayment: pay(2) });
                passEffectsStack(game);
                if (history === "previous") advanceToMain(game, p.id, game.state.turn.number);
              }
              const available = empty
                ? []
                : [
                    p.card(fireball, { zone: "graveyard" }),
                    p.card(impassionedTutor),
                    p.card(combustiblePotion),
                  ];
              const chosen = available.slice(0, count);
              const cost = harmonize ? 2 : matching ? 1 : 3;
              const before = game.state;
              expect(() => p.activate(card, { reservePayment: pay(cost - 1) })).toThrow();
              expect(game.state).toEqual(before);
              expect(() => p.activate(card, { reservePayment: pay(cost + 1) })).toThrow();
              expect(game.state).toEqual(before);
              p.activate(card, { reservePayment: pay(cost) });
              passEffectsStack(game);
              if (!empty) {
                expect(game.state.decision).toMatchObject({
                  kind: "resolve-effect-choice",
                  playerId: p.id,
                });
                const suspended = game.state;
                for (const ids of [
                  [p.card(favorableWinds).objectId],
                  [q.card(fireball).objectId],
                  [p.cards(fireball, { zone: "hand" })[0]!.objectId],
                  [available[0]!.objectId, available[0]!.objectId],
                ]) {
                  expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                  expect(game.state).toEqual(suspended);
                }
                answerDecision(
                  game,
                  "resolve-effect-choice",
                  chosen.map((c) => c.objectId),
                );
                passEffectsStack(game);
              } else expect(game.state.decision).toBeNull();
              for (const ref of available)
                expect(game.state.objects[ref.objectId]?.zone).toBe(
                  chosen.includes(ref) ? "banishment" : "graveyard",
                );
              expect(p.cards(favorableWinds, { zone: "graveyard" })).toHaveLength(1);
              const initial = history === "own" ? count : 0;
              expect(game.state.objects[hero.objectId]?.damage).toBe(initial);
              expect(game.state.objects[foe.objectId]?.damage).toBe(initial);
              // A non-Spell action must not consume the pending Empower.
              p.activate(singeingLeap, { reservePayment: pay(1) });
              passEffectsStack(game);
              expect(game.state.objects[hero.objectId]?.damage).toBe(initial + 1);
              if (expired) advanceToMain(game, p.id, game.state.turn.number);
              for (const [index, spell] of p.cards(fireball, { zone: "hand" }).entries()) {
                p.activate(spell, {
                  reservePayment: pay(matching ? 2 : 4),
                  targets: { "target-1": [foe.objectId] },
                });
                passEffectsStack(game);
                expect(game.state.objects[foe.objectId]?.damage).toBe(
                  initial + index + 1 + (expired ? 0 : base + count),
                );
              }
            });
}
