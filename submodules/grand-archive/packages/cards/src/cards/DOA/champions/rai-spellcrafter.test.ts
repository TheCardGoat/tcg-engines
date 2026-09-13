import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { raiSpellcrafter } from "./rai-spellcrafter.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers gPKTJKqvOI-a1 */
it("places exactly two enlighten counters on the leveled champion when entry resolves", () => {
  const starter = lineageTestChampion("Rai", 0);
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      zones: { "material-deck": [raiSpellcrafter], memory: [woodlandSquirrels] },
    },
    playerTwo: { champion: starter },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    id = p.card(starter).objectId;
  p.materialize(raiSpellcrafter);
  expect(p.zone("memory")).toHaveLength(0);
  expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(0);
  passEffectsStack(game);
  expect(game.state.objects[id]!.activeDefinitionId).toBe(raiSpellcrafter.canonicalId);
  expect(game.state.objects[id]!.counters.enlighten).toBe(2);
  expect(game.state.objects[q.card(starter).objectId]!.counters.enlighten ?? 0).toBe(0);
});
