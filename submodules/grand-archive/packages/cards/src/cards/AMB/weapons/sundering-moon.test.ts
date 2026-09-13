import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { requireSingleFace } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { condensedSupernova } from "../../ALC/items/condensed-supernova.ts";
import { sunderingMoon } from "./sundering-moon.ts";

/** @covers 8677jq0hfm-a1 */
describe("Sundering Moon — Jin Bonus On Enter", () => {
  for (const [jin, windAllies] of [
    [true, 2],
    [true, 1],
    [false, 2],
  ] as const) {
    it(`gains +1 POWER only for Jin with two wind allies (jin=${jin} winds=${windAllies})`, () => {
      const { starter } = classBonusLeveledChampion(sunderingMoon, true, 0);
      if (starter.layout.kind !== "single-faced") throw new Error("Expected champion");
      const champion = {
        ...starter,
        layout: {
          kind: "single-faced" as const,
          face: { ...starter.layout.face, lineageName: jin ? "Jin" : "Other" },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [sunderingMoon],
            field: Array.from({ length: windAllies }, () => galesMare),
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const attacker = player.card(champion, { zone: "field" });
      const target = game.player("player-two").card(lineageTestChampion("Opponent", 0), {
        zone: "field",
      });
      player.materialize(sunderingMoon);
      player.pass();
      game.player("player-two").pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "8677jq0hfm-a1",
        ),
      ).toBe(jin);
      passEffectsStack(game);
      for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      const weapon = player.card(sunderingMoon, { zone: "field" });
      player.declareAttack(attacker, target, { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(jin && windAllies >= 2 ? 2 : 1);
    });
  }
});

/** @covers 8677jq0hfm-a2 */
describe("Sundering Moon — Jin Bonus prevention", () => {
  it("returns itself to the material deck and prevents the next 1 damage", () => {
    const { starter, lineage } = classBonusLeveledChampion(sunderingMoon, true, 1);
    const withJinName = (card: typeof starter): typeof starter => ({
      ...card,
      layout: {
        kind: "single-faced" as const,
        face: { ...requireSingleFace(card), lineageName: "Jin" },
      },
    });
    const jin = withJinName(starter);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: jin,
        lineage: lineage.map(withJinName),
        zones: {
          field: [sunderingMoon, condensedSupernova],
          hand: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const champion = player.card(jin, { zone: "field" });
    const weapon = player.card(sunderingMoon, { zone: "field" });
    player.activateAbility(sunderingMoon, "8677jq0hfm-a2", {
      targets: { "target-1": [champion.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    expect(game.state.objects[weapon.objectId]!.zone).toBe("material-deck");
    passEffectsStack(game);
    player.activateAbility(condensedSupernova, "14m4c8ljye-a2");
    passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.damage).toBe(0);
  });

  it("cannot activate without Jin", () => {
    const starter = lineageTestChampion("Other", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: { field: [sunderingMoon], hand: [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(sunderingMoon, "8677jq0hfm-a2", {
        targets: { "target-1": [player.card(starter, { zone: "field" }).objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
