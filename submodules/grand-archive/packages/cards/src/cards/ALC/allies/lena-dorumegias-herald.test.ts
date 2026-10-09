import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { battlefieldSpotter } from "./battlefield-spotter.ts";
import { shimmercloakAssassin } from "./shimmercloak-assassin.ts";
import { lenaDorumegiasHerald } from "./lena-dorumegias-herald.ts";

/** @covers gwve1d47o7-a1 */
describe("Lena, Dorumegia's Herald — Class Bonus True Sight", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "can" : "cannot"} attack a Stealth unit when Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        lenaDorumegiasHerald,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [lenaDorumegiasHerald] } },
        playerTwo: { champion, zones: { field: [shimmercloakAssassin] } },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(shimmercloakAssassin);
      if (!classBonus) {
        expect(() => player.declareAttack(lenaDorumegiasHerald, target)).toThrow(
          "legal attack target",
        );
        return;
      }
      player.declareAttack(lenaDorumegiasHerald, target);
      expect(game.state.combat?.targetIds).toEqual([target.objectId]);
    });
  }
});

/** @covers gwve1d47o7-a2 */
describe("Lena, Dorumegia's Herald — distant activation", () => {
  it("discounts the ability only while distant and moves a looked-at Ranger ally to hand", () => {
    const champion = createClassBonusTestChampion(
      lenaDorumegiasHerald,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [lenaDorumegiasHerald],
          hand: [reposition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [
            battlefieldSpotter,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const lena = player.card(lenaDorumegiasHerald);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    expect(() =>
      player.activateAbility(lena, "gwve1d47o7-a2", {
        reservePayment: payments
          .slice(0, 2)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
    player.activate(reposition, {
      targets: { "target-1": [lena.objectId] },
      reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
    });
    passEffectsStack(game);
    player.activateAbility(lena, "gwve1d47o7-a2", {
      reservePayment: payments.slice(1).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const chosen = player.card(battlefieldSpotter, { zone: "main-deck" });
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(
        game,
        "resolve-effect-choice",
        player
          .zone("main-deck")
          .map((card) => card.objectId)
          .reverse(),
      );
      passEffectsStack(game);
    }
    expect(game.state.decision).toBeNull();
    expect(game.state.stack).toHaveLength(0);
    expect(player.cards(battlefieldSpotter, { zone: "hand" })).toHaveLength(1);
    expect(player.zone("main-deck")).toHaveLength(3);
    expect(game.state.objects[lena.objectId]!.states.has("rested")).toBe(true);
  });
});

/** @covers gwve1d47o7-a2 */
describe("Lena — one Ranger ally choice and ordered deck return", () => {
  for (const matching of [false, true])
    for (const distant of [false, true])
      for (const length of [0, 1, 3, 4, 6])
        for (const mode of ["take", "decline", "no-match"] as const)
          it(`matching=${matching}, distant=${distant}, length=${length}, mode=${mode}`, () => {
            const champion = createClassBonusTestChampion(
              lenaDorumegiasHerald,
              matching,
              "activation-discount",
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [lenaDorumegiasHerald],
                  hand: [
                    reposition,
                    battlefieldSpotter,
                    ...Array.from({ length: 6 }, () => woodlandSquirrels),
                  ],
                  "main-deck": Array.from({ length }, (_, i) =>
                    mode !== "no-match" && (i === 0 || i >= 3)
                      ? battlefieldSpotter
                      : i % 2
                        ? reposition
                        : woodlandSquirrels,
                  ),
                },
              },
              playerTwo: { champion, zones: { "main-deck": [battlefieldSpotter] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const lena = p.card(lenaDorumegiasHerald, { zone: "field" });
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (distant) {
              p.activate(reposition, {
                targets: { "target-1": [lena.objectId] },
                reservePayment: payment.slice(0, 1),
              });
              passEffectsStack(game);
            }
            const cost = distant ? 2 : 4,
              offset = distant ? 1 : 0;
            const before = game.state;
            for (const wrong of [cost - 1, cost + 1]) {
              expect(() =>
                p.activateAbility(lena, "gwve1d47o7-a2", {
                  reservePayment: payment.slice(offset, offset + wrong),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const deck = p.zone("main-deck"),
              looked = deck.slice(0, 4),
              held = p.card(battlefieldSpotter, { zone: "hand" });
            const chosen =
              mode === "take"
                ? looked.filter((c) => c.definitionId === battlefieldSpotter.canonicalId).at(-1)
                : undefined;
            p.activateAbility(lena, "gwve1d47o7-a2", {
              reservePayment: payment.slice(offset, offset + cost),
            });
            expect(game.state.objects[lena.objectId]?.states.has("rested")).toBe(true);
            passEffectsStack(game);
            if (
              game.state.decision?.kind === "resolve-effect-choice" &&
              game.state.decision.selection.id === "ranger-ally"
            ) {
              const before = game.state;
              for (const bad of [
                held,
                lena,
                q.zone("main-deck")[0]!,
                ...deck.slice(4),
                ...looked.filter((c) => c.definitionId !== battlefieldSpotter.canonicalId),
              ]) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", chosen ? [chosen.objectId] : []);
              passEffectsStack(game);
            }
            expect(p.cards(battlefieldSpotter, { zone: "hand" }).map((c) => c.objectId)).toEqual([
              held.objectId,
              ...(chosen ? [chosen.objectId] : []),
            ]);
            const remainder = looked
              .filter((c) => c.objectId !== chosen?.objectId)
              .reverse()
              .map((c) => c.objectId);
            if (game.state.decision?.kind === "resolve-effect-choice") {
              expect(game.state.decision.selection.id).not.toBe("ranger-ally");
              const before = game.state;
              for (const bad of [[], remainder.slice(1), [held.objectId, ...remainder.slice(1)]]) {
                expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", remainder);
              passEffectsStack(game);
            }
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
              ...deck.slice(4).map((c) => c.objectId),
              ...remainder,
            ]);
            expect(p.zone("memory").map((c) => c.objectId)).toEqual(
              payment.slice(0, cost + offset).map((c) => c.cardId),
            );
            expect(
              game.state.eventHistory
                .filter((e) => e.type === "card-revealed")
                .map((e) => e.objectId),
            ).toEqual(chosen ? [chosen.objectId] : []);
            expect(p.card(lenaDorumegiasHerald, { zone: "field" })).toEqual(lena);
            expect(q.zone("main-deck")).toHaveLength(1);
            expect(game.state.winnerIds).toEqual([]);
          });
});
