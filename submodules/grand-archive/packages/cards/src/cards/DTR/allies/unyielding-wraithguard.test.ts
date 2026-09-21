import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { unyieldingWraithguard } from "./unyielding-wraithguard.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0vjo15768g-a2 */
describe("Unyielding Wraithguard — death returns a new ephemeral object", () => {
  it("returns after its first death but is banished permanently when the ephemeral ally dies", () => {
    const champion = createClassBonusTestChampion(
      unyieldingWraithguard,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [unyieldingWraithguard] } },
      playerTwo: { champion, zones: { field: Array.from({ length: 4 }, () => woodlandSquirrels) } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const guard = p.card(unyieldingWraithguard);
    const initialIncarnation = game.state.objects[guard.objectId]!.incarnation;
    for (const [index, attacker] of q.cards(woodlandSquirrels).entries()) {
      q.declareAttack(attacker, guard);
      if (index === 1) {
        advanceCombatToTrigger(game, "0vjo15768g-a2");
        expect(game.state.objects[guard.objectId]!.zone).toBe("graveyard");
        expect(
          game.state.stack.some(
            (s) => s.kind === "triggered-ability" && s.ability.id === "0vjo15768g-a2",
          ),
        ).toBe(true);
        passEffectsStack(game);
        expect(game.state.objects[guard.objectId]!.zone).toBe("field");
        expect(game.state.objects[guard.objectId]!.incarnation).toBeGreaterThan(initialIncarnation);
        expect(game.state.objects[guard.objectId]!.states.has("ephemeral")).toBe(true);
        expect(game.state.objects[guard.objectId]!.damage).toBe(0);
      }
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[guard.objectId]!.zone).toBe(index === 3 ? "banishment" : "field");
    }
    expect(p.cards(unyieldingWraithguard, { zone: "graveyard" })).toHaveLength(0);
    expect(p.cards(unyieldingWraithguard, { zone: "field" })).toHaveLength(0);
    expect(game.state.stack).toHaveLength(0);
  });
});
