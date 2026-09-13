import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { prismaticCodex } from "./prismatic-codex.ts";

/** @covers czvy67nbin-a1 */
describe("Prismatic Codex — age on recollection", () => {
  it("gains one age on each of its controller's recollection phases", () => {
    const champion = createClassBonusTestChampion(prismaticCodex, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [prismaticCodex],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
    });
    const codex = game.player("player-one").card(prismaticCodex, { zone: "field" });
    const age = () => game.state.objects[codex.objectId]?.counters["named:age"] ?? 0;
    advanceToRecollection(game, "player-two");
    expect(age()).toBe(0);
    advanceToRecollection(game, "player-one");
    expect(game.state.stack).toHaveLength(1);
    passEffectsStack(game);
    expect(age()).toBe(1);
  });
});

/** @covers czvy67nbin-a2 */
describe("Prismatic Codex — ignore elemental requirements", () => {
  it("banishes at three age counters so the next activation may ignore elements", () => {
    const champion = createClassBonusTestChampion(prismaticCodex, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [prismaticCodex],
          hand: [igniteTheSoul, woodlandSquirrels],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const codex = player.card(prismaticCodex, { zone: "field" });
    const beforeYoung = game.state;
    expect(() => player.activateAbility(codex, "czvy67nbin-a2")).toThrow();
    expect(game.state).toEqual(beforeYoung);
    for (let turn = 0; turn < 3; turn += 1) {
      advanceToRecollection(game, "player-one");
      passEffectsStack(game);
    }
    expect(game.state.objects[codex.objectId]!.counters["named:age"]).toBe(3);
    player.activateAbility(codex, "czvy67nbin-a2");
    passEffectsStack(game);
    player.activate(igniteTheSoul, {
      targets: { "target-1": [game.player("player-two").card(champion).objectId] },
      reservePayment: [
        { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
      ],
    });
    expect(player.cards(igniteTheSoul, { zone: "effects-stack" })).toHaveLength(1);
  });
});
