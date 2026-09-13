import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { reposition } from "./reposition.ts";
import { perfectRepulsion } from "./perfect-repulsion.ts";

function fixture() {
  const champion = createClassBonusTestChampion(perfectRepulsion, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [
          perfectRepulsion,
          reposition,
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ],
        field: [giantTortoise, sealedBladeDoa],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: { field: [giantTortoise, automatedGardener, ferventBeastmaster] },
    },
  });
  return { game, champion };
}

/** @covers gwj4f15joh-a1 */
describe("Perfect Repulsion — exact snapshotted damage", () => {
  it("rejects uncontrolled/non-unit targets and prevents only the snapshotted amount once", () => {
    const { game } = fixture();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(giantTortoise, { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" });
    opponent.pass();
    for (const invalid of [
      opponent.card(giantTortoise, { zone: "field" }),
      player.card(sealedBladeDoa, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(perfectRepulsion, {
          reservePayment: payment
            .slice(0, 2)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    player.activate(perfectRepulsion, {
      reservePayment: payment.slice(0, 2).map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(player.zone("memory")).toHaveLength(2);

    opponent.pass();
    player.activate(reposition, {
      reservePayment: [{ kind: "card", cardId: payment[2]!.objectId }],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(player.zone("memory")).toHaveLength(3);

    opponent.declareAttack(opponent.card(automatedGardener, { zone: "field" }), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    expect(player.zone("hand")).toHaveLength(1);

    opponent.declareAttack(opponent.card(ferventBeastmaster, { zone: "field" }), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    expect(player.zone("hand")).toHaveLength(1);
  });
});
