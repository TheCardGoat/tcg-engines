import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sagesUrn } from "./sages-urn.ts";

/** @covers s7a4tm04ll-a1 */
describe("Sage's Urn — age on recollection", () => {
  it("gains age only while it has fewer than four counters", () => {
    const champion = createClassBonusTestChampion(sagesUrn, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [sagesUrn],
          "main-deck": Array.from({ length: 16 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 16 }, () => woodlandSquirrels) },
      },
    });
    const urn = game.player("player-one").card(sagesUrn, { zone: "field" });
    const age = () => game.state.objects[urn.objectId]?.counters["named:age"] ?? 0;
    for (let turn = 0; turn < 4; turn += 1) {
      advanceToRecollection(game, "player-one");
      passEffectsStack(game);
      expect(age()).toBe(turn + 1);
    }
    advanceToRecollection(game, "player-one");
    expect(game.state.stack).toHaveLength(1);
    passEffectsStack(game);
    expect(age()).toBe(4);
  });
});

/** @covers s7a4tm04ll-a2 */
describe("Sage's Urn — Empower X", () => {
  it("banishes itself to Empower equal to the age counters it had", () => {
    const champion = createClassBonusTestChampion(sagesUrn, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [sagesUrn],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const urn = player.card(sagesUrn, { zone: "field" });
    for (let turn = 0; turn < 2; turn += 1) {
      advanceToRecollection(game, "player-one");
      passEffectsStack(game);
    }
    expect(game.state.objects[urn.objectId]!.counters["named:age"]).toBe(2);
    player.activateAbility(urn, "s7a4tm04ll-a2");
    expect(player.cards(sagesUrn, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.players[player.id]!.states.empower).toBe(2);
  });
});
