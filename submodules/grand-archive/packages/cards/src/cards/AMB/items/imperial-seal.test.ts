import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { imperialSeal } from "./imperial-seal.ts";

/** @covers by8145w2u2-a2 */
describe("Imperial Seal — basic elements", () => {
  it("banishes itself to enable fire, water, and wind until end of turn", () => {
    const champion = createClassBonusTestChampion(imperialSeal, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [imperialSeal],
          hand: [igniteTheSoul, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const beforeFire = game.state;
    expect(() =>
      player.activate(igniteTheSoul, {
        targets: { "target-1": [game.player("player-two").card(champion).objectId] },
        reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeFire);

    player.activateAbility(imperialSeal, "by8145w2u2-a2");
    expect(player.cards(imperialSeal, { zone: "field" })).toHaveLength(0);
    expect(() =>
      player.activate(igniteTheSoul, {
        targets: { "target-1": [game.player("player-two").card(champion).objectId] },
        reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
      }),
    ).toThrow();
    passEffectsStack(game);
    player.activate(igniteTheSoul, {
      targets: { "target-1": [game.player("player-two").card(champion).objectId] },
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    expect(player.cards(igniteTheSoul, { zone: "effects-stack" })).toHaveLength(1);
  });
});
