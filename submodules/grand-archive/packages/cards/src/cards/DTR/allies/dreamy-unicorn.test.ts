import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { dreamyUnicorn } from "./dreamy-unicorn.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ty0tcpdiny-a2 */
it("adds preparation to its own champion only when the death trigger resolves", () => {
  const champion = createClassBonusTestChampion(dreamyUnicorn, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [dreamyUnicorn, dreamyUnicorn] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const attackers = p.cards(woodlandSquirrels),
    unicorns = q.cards(dreamyUnicorn);
  for (let i = 0; i < 2; i++) {
    p.declareAttack(attackers[2 * i]!, unicorns[i]!);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[unicorns[i]!.objectId]!.zone).toBe("field");
    expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(i);
    p.declareAttack(attackers[2 * i + 1]!, unicorns[i]!);
    advanceCombatToTrigger(game, "ty0tcpdiny-a2");
    expect(game.state.objects[unicorns[i]!.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(i);
    passEffectsStack(game);
    expect(game.state.objects[q.card(champion).objectId]!.counters.preparation).toBe(i + 1);
    expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
  }
});
