import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { arisannaHerbalistProdigy } from "./arisanna-herbalist-prodigy.ts";

const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf] as const;

/** @covers b31x97n2jn-a1 */
describe("Arisanna, Herbalist Prodigy — On Enter Gather twice", () => {
  it("levels publicly, then resolves a separate trigger that summons two ingredient tokens", () => {
    const starter = lineageTestChampion("Arisanna", 0);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [arisannaHerbalistProdigy],
          memory: [woodlandSquirrels],
        },
      },
      playerTwo: { champion: opponentChampion },
      definitions: herbs,
    });
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    player.materialize(arisannaHerbalistProdigy);
    player.pass();
    game.player("player-two").pass();

    expect(game.state.objects[champion.objectId]!.activeDefinitionId).toBe(
      arisannaHerbalistProdigy.canonicalId,
    );
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "b31x97n2jn-a1",
      ),
    ).toBe(true);
    expect(
      player.zone("field").filter((object) => game.state.objects[object.objectId]!.isToken),
    ).toHaveLength(0);
    passEffectsStack(game);

    const tokens = player
      .zone("field")
      .filter((object) => game.state.objects[object.objectId]!.isToken);
    expect(tokens).toHaveLength(2);
    expect(
      tokens.every((token) => herbs.some((herb) => herb.canonicalId === token.definitionId)),
    ).toBe(true);
    expect(game.player("player-two").zone("field")).toHaveLength(1);
  });
});
