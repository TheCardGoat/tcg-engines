import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { platedBullet } from "../../P24/items/plated-bullet.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { cascadingRound } from "../items/cascading-round.ts";
import { magebaneLash } from "../weapons/magebane-lash.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { forceLoad } from "./force-load.ts";

/** @covers y6isxy5lh2-a1 */
describe("Force Load — choose an eligible Bullet and load a controlled Gun", () => {
  it("enforces the target and material-deck filters before loading the chosen Bullet", () => {
    const champion = createClassBonusTestChampion(forceLoad, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [seekersRifle, magebaneLash, woodlandSquirrels],
          hand: [forceLoad, woodlandSquirrels, woodlandSquirrels],
          "material-deck": [platedBullet, cascadingRound, slateWhetstone],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [seekersRifle], "material-deck": [platedBullet] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const gun = player.card(seekersRifle, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));

    for (const invalid of [
      player.card(magebaneLash, { zone: "field" }),
      player.card(woodlandSquirrels, { zone: "field" }),
      opponent.card(seekersRifle, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(forceLoad, {
          reservePayment: payment,
          targets: { "target-gun": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    const beforeUnderpayment = game.state;
    expect(() =>
      player.activate(forceLoad, {
        reservePayment: payment.slice(0, 1),
        targets: { "target-gun": [gun.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeUnderpayment);

    player.activate(forceLoad, {
      reservePayment: payment,
      targets: { "target-gun": [gun.objectId] },
    });
    expect(player.zone("memory")).toHaveLength(2);
    expect(player.cards(platedBullet, { zone: "material-deck" })).toHaveLength(1);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");

    for (const invalid of [
      [],
      [player.card(cascadingRound, { zone: "material-deck" }).objectId],
      [player.card(slateWhetstone, { zone: "material-deck" }).objectId],
      [opponent.card(platedBullet, { zone: "material-deck" }).objectId],
    ]) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
      expect(game.state).toEqual(before);
    }

    const chosen = player.card(platedBullet, { zone: "material-deck" });
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);

    expect(game.state.objects[chosen.objectId]!.zone).toBe("loaded");
    expect(game.state.objects[chosen.objectId]!.hostId).toBe(gun.objectId);
    expect(player.cards(cascadingRound, { zone: "material-deck" })).toHaveLength(1);
    expect(player.cards(slateWhetstone, { zone: "material-deck" })).toHaveLength(1);
  });
});
