import { describe, expect, it } from "vitest";
import { rainwovenCrysalis } from "./rainwoven-crysalis.ts";
import { proveChampionNextPrevention } from "../../../testing/champion-next-prevention.ts";
/** @covers 6dK2HO0ajX-a1 */
describe("rainwoven-crysalis — next champion damage", () => {
  proveChampionNextPrevention({ card: rainwovenCrysalis, enlighten: false, reserveCost: 2 });
});

import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
/** @covers 6dK2HO0ajX-a2 */
describe("Rainwoven Crysalis Merlin bonus", () => {
  for (const matching of [false, true]) {
    it(`adds mastery counters only with current Merlin lineage: ${matching}`, () => {
      const successor = enableAllTestElements(
        lineageTestChampion(matching ? "Merlin" : "Other", 2),
      );
      const { game, p, q, hero, foe, pay } = fracturedMemoriesFixture(
        [sparkAlight, rainwovenCrysalis, rainwovenCrysalis],
        [],
        [successor],
      );
      p.activate(sparkAlight, { reservePayment: pay(2), targets: { "target-1": [foe.objectId] } });
      passEffectsStack(game);
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
        else throw new Error(`Unexpected wait: ${wait.kind}`);
      }
      p.materialize(successor);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      expect(game.state.players[p.id]!.mastery?.name).toBe("Fractured Memories");
      for (let cast = 1; cast <= 2; cast++) {
        p.activate(p.cards(rainwovenCrysalis, { zone: "hand" })[0]!, { reservePayment: pay(2) });
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(
          matching ? (cast - 1) * 2 : 0,
        );
        passEffectsStack(game);
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(
          matching ? cast * 2 : 0,
        );
        expect(game.state.objects[hero.objectId]!.counters["named:sheen"] ?? 0).toBe(0);
        expect(game.state.players[q.id]!.mastery).toBeUndefined();
      }
    });
  }
});
