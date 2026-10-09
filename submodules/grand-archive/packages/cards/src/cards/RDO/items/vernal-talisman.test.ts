import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { vernalTalisman } from "./vernal-talisman.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meadowbloomDryad } from "../../DOA/allies/meadowbloom-dryad.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers dW5uyngvJW-a1 */
/** @covers dW5uyngvJW-a2 */
describe("Vernal Talisman — preserved payment and Class Bonus entry draw", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 2, 3])
      it(`class=${matching}, preserved cards=${count}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(vernalTalisman, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => meadowbloomDryad),
              "material-deck": [vernalTalisman, trainingSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => ferventBeastmaster),
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const attackers = q.cards(ferventBeastmaster, { zone: "field" });
        for (const [index, ally] of p.cards(meadowbloomDryad, { zone: "field" }).entries()) {
          q.declareAttack(attackers[index]!, ally);
          game.resolveCombatWithoutRetaliation();
          passEffectsStack(game);
        }
        for (let step = 0; step < 64; step++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
          if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        const preserved = p
          .cards(meadowbloomDryad, { zone: "material-deck" })
          .map((c) => c.objectId);
        expect(preserved).toHaveLength(count);
        for (const id of preserved)
          expect(game.state.objects[id]!.states.has("preserved")).toBe(true);
        const invalid = [
          [],
          [p.card(trainingSword).objectId],
          ...(preserved.length
            ? [
                [preserved[0]!],
                [preserved[0]!, preserved[0]!],
                [preserved[0]!, p.card(trainingSword).objectId],
              ]
            : []),
          ...(count > 2 ? [preserved] : []),
        ];
        for (const selection of invalid) {
          const before = game.state;
          expect(() => p.materialize(vernalTalisman, { costSelections: [selection] })).toThrow();
          expect(game.state).toEqual(before);
        }
        if (count < 2) return;
        const deck = p.zone("main-deck"),
          hand = p.zone("hand");
        p.materialize(vernalTalisman, { costSelections: [preserved.slice(0, 2)] });
        for (const id of preserved.slice(0, 2))
          expect(game.state.objects[id]!.zone).toBe("banishment");
        if (count === 3) expect(game.state.objects[preserved[2]!]!.zone).toBe("material-deck");
        expect(p.zone("hand")).toEqual(hand);
        expect(p.zone("main-deck")).toEqual(deck);
        p.pass();
        q.pass();
        expect(p.cards(vernalTalisman, { zone: "field" })).toHaveLength(1);
        expect(
          game.state.stack.some(
            (s) => s.kind === "triggered-ability" && s.ability.id === "dW5uyngvJW-a2",
          ),
        ).toBe(matching);
        expect(p.zone("hand")).toEqual(hand);
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual([...hand, ...deck.slice(0, matching ? 1 : 0)]);
        expect(p.zone("main-deck")).toEqual(deck.slice(matching ? 1 : 0));
        expect(q.zone("hand")).toHaveLength(0);
      });
});
