import { alacritousHuntress } from "./alacritous-huntress.ts";
import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 7i24g0nbxz-a1 */
describe("alacritous-huntress — Ranged combat", () => {
  proveRangedAlly({ card: alacritousHuntress, power: 2, ranged: 2, classBonus: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { resonantAether } from "../actions/resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7i24g0nbxz-a2 */
describe("Alacritous Huntress — reveal then optional discard or load", () => {
  for (const host of [false, true])
    for (const choice of ["none", "keep", "discard", "load"] as const) {
      if (!host && choice === "load") continue;
      it(`draws only after discarding/loading the revealed charge: host=${host}, choice=${choice}`, () => {
        const champion = createClassBonusTestChampion(
          alacritousHuntress,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                alacritousHuntress,
                resonantAether,
                resonantAether,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              field: [trainingSword, ...(host ? [trivariateDream] : [])],
              graveyard: [resonantAether],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [trivariateDream], hand: [resonantAether] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const charges = p.cards(resonantAether, { zone: "hand" }),
          charge = charges[0]!;
        const top = p.zone("main-deck")[0]!;
        p.activate(alacritousHuntress, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((card) => ({ kind: "card", cardId: card.objectId })),
        });
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[p.card(alacritousHuntress).objectId]!.zone).toBe("field");
        for (const invalid of [
          [q.card(resonantAether).objectId],
          [p.card(resonantAether, { zone: "graveyard" }).objectId],
          [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
          charges.map((card) => card.objectId),
        ]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", choice === "none" ? [] : [charge.objectId]);
        passEffectsStack(game);
        if (choice !== "none") {
          expect(game.state.objects[charge.objectId]!.zone).toBe("hand");
          expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
          answerDecision(game, "resolve-optional-effect", choice === "discard");
          passEffectsStack(game);
          if (choice !== "discard" && host) {
            answerDecision(game, "resolve-optional-effect", choice === "load");
            passEffectsStack(game);
            if (choice === "load") {
              expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
              for (const invalid of [
                q.card(trivariateDream),
                p.card(trainingSword),
                p.card(alacritousHuntress),
              ]) {
                const before = game.state;
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [p.card(trivariateDream).objectId]);
              passEffectsStack(game);
            }
          }
        }
        expect(game.state.objects[top.objectId]!.zone).toBe(
          choice === "load" || choice === "discard" ? "hand" : "main-deck",
        );
        expect(game.state.objects[charge.objectId]!.zone).toBe(
          choice === "load" ? "loaded" : choice === "discard" ? "graveyard" : "hand",
        );
        expect(game.state.objects[charges[1]!.objectId]!.zone).toBe("hand");
        expect(
          game.state.eventHistory
            .filter((event) => event.type === "card-revealed")
            .map((event) => event.objectId),
        ).toEqual(choice === "none" ? [] : [charge.objectId]);
        expect(q.zone("hand")).toHaveLength(1);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
        if (choice === "load") {
          p.declareAttack(p.card(champion), q.card(champion), {
            weaponIds: [p.card(trivariateDream).objectId],
          });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
          expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
        }
      });
    }
});
