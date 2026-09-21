import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { skilledAerotheurge } from "./skilled-aerotheurge.ts";

/** @covers 58xpspudnf-a3 */
describe("Skilled Aerotheurge — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: skilledAerotheurge });
});
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 58xpspudnf-a1 */
describe("skilled-aerotheurge — Ranged combat", () => {
  proveRangedAlly({ card: skilledAerotheurge, power: 1, ranged: 2, classBonus: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { teasingAerocharge } from "../actions/teasing-aerocharge.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers 58xpspudnf-a2 */
describe("Skilled Aerotheurge — distant on-hit loading", () => {
  for (const distant of [false, true])
    for (const load of [false, true])
      it(`requires a hit and distance, with graveyard/host eligibility and optional load=${load}, distant=${distant}`, () => {
        const champion = createClassBonusTestChampion(
          skilledAerotheurge,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [skilledAerotheurge, trivariateDream, trainingSword],
              hand: [reposition, woodlandSquirrels, teasingAerocharge],
              graveyard: [teasingAerocharge, resonantAether, skilledAerotheurge],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [trivariateDream], graveyard: [teasingAerocharge] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(skilledAerotheurge, { zone: "field" });
        const charge = p.card(teasingAerocharge, { zone: "graveyard" });
        const host = p.card(trivariateDream);
        if (distant) {
          p.activate(reposition, {
            targets: { "target-1": [source.objectId] },
            reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
        p.declareAttack(source, q.card(champion));
        expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
        advanceCombatToTrigger(game, "58xpspudnf-a2");
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(distant ? 3 : 1);
        for (const invalid of [
          q.card(teasingAerocharge),
          p.card(teasingAerocharge, { zone: "hand" }),
          p.card(resonantAether),
          p.card(skilledAerotheurge, { zone: "graveyard" }),
        ]) {
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-card": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-card": [charge.objectId] },
        });
        passEffectsStack(game);
        if (distant) {
          answerDecision(game, "resolve-optional-effect", load);
          passEffectsStack(game);
          if (load) {
            for (const invalid of [q.card(trivariateDream), p.card(trainingSword), source]) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [host.objectId]);
            passEffectsStack(game);
          }
        } else expect(game.state.decision).toBeNull();
        expect(game.state.objects[charge.objectId]!.zone).toBe(
          distant && load ? "loaded" : "graveyard",
        );
        game.resolveCombatWithoutRetaliation();
        if (distant && load) {
          expect(game.state.objects[charge.objectId]!.hostId).toBe(host.objectId);
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
          expect(game.state.objects[charge.objectId]!.zone).toBe("intent");
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(5);
          expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
        }
      });
});
