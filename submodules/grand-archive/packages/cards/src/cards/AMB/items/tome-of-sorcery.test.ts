import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tomeOfSorcery } from "./tome-of-sorcery.ts";

function championAt(level: number, classBonus: boolean) {
  return grantTestChampionLevel(
    createClassBonusTestChampion(tomeOfSorcery, classBonus, "activation-discount"),
    level,
  );
}

/** @covers sq0ou8vas3-a1 */
describe("Tome of Sorcery — Class Bonus Level 2 On Enter", () => {
  for (const classBonus of [false, true]) {
    for (const level of [1, 2]) {
      it(`${classBonus && level >= 2 ? "draws" : "does not draw"} at class=${classBonus} level=${level}`, () => {
        const champion = championAt(level, classBonus);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [tomeOfSorcery],
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const top = player.zone("main-deck")[0]!;
        player.materialize(tomeOfSorcery);
        player.pass();
        game.player("player-two").pass();
        const shouldDraw = classBonus && level >= 2;
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "sq0ou8vas3-a1",
          ),
        ).toBe(shouldDraw);
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]?.zone).toBe(shouldDraw ? "memory" : "main-deck");
      });
    }
  }
});

/** @covers sq0ou8vas3-a2 */
describe("Tome of Sorcery — Empower 1", () => {
  it("rests to Empower 1", () => {
    const champion = createClassBonusTestChampion(tomeOfSorcery, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [tomeOfSorcery] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const tome = player.card(tomeOfSorcery, { zone: "field" });
    player.activateAbility(tome, "sq0ou8vas3-a2");
    expect(game.state.objects[tome.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.players[player.id]!.states.empower).toBeUndefined();
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(1);
  });
});
