import { describe, expect, it } from "vitest";
import { conjuringFluorescence } from "./conjuring-fluorescence.ts";
import { proveEffectRegaliaMaterialization } from "../../../testing/effect-regalia-materialization.ts";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { rainwovenCrysalis } from "./rainwoven-crysalis.ts";
import { moltenEcho } from "./molten-echo.ts";

/** @covers Erpyb3AGgp-a2 */
describe("Conjuring Fluorescence — materialize regalia with its costs", () => {
  proveEffectRegaliaMaterialization(conjuringFluorescence, false);
});
/** @covers Erpyb3AGgp-a1 */
describe("Conjuring Fluorescence — fast only with Merlin and at least eight mastery sheen", () => {
  for (const matching of [false, true])
    for (const sheen of [6, 7, 8, 9])
      it(`current Merlin=${matching}, mastery sheen=${sheen}`, () => {
        const successor = enableAllTestElements(
          lineageTestChampion(matching ? "Merlin" : "Other", 2),
        );
        const { game, p, q, foe, pay } = fracturedMemoriesFixture(
          [
            conjuringFluorescence,
            ...Array.from({ length: Math.floor(sheen / 2) }, () => rainwovenCrysalis),
            ...(sheen % 2 ? [moltenEcho] : []),
          ],
          [],
          [successor],
        );
        for (const rain of p.cards(rainwovenCrysalis, { zone: "hand" })) {
          p.activate(rain, { reservePayment: pay(2) });
          passEffectsStack(game);
        }
        if (sheen % 2) {
          p.activate(moltenEcho, {
            reservePayment: pay(2),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(sheen);
        const initialTurn = game.state.turn.number;
        for (let step = 0; step < 128; step++) {
          const wait = game.waitState();
          if (
            wait.kind === "materialization-choice" &&
            wait.playerId === p.id &&
            game.state.turn.number > initialTurn
          )
            break;
          if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected wait ${wait.kind}`);
        }
        p.materialize(successor);
        passEffectsStack(game);
        advanceToMain(game, q.id);
        q.pass();
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(sheen);
        const canFast = matching && sheen >= 8;
        if (!canFast) {
          const before = game.state;
          expect(() => p.activate(conjuringFluorescence, { reservePayment: pay(3) })).toThrow();
          expect(game.state).toEqual(before);
          advanceToMain(game, p.id);
        }
        p.activate(conjuringFluorescence, { reservePayment: pay(3) });
        if (canFast) expect(game.state.turn.playerId).toBe(q.id);
        passEffectsStack(game);
        expect(p.card(conjuringFluorescence, { zone: "graveyard" })).toBeDefined();
        expect(game.state.decision).toBeNull();
      });
});
