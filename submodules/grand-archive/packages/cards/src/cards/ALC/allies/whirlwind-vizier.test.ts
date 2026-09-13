import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fractalOfSnow } from "../phantasias/fractal-of-snow.ts";
import { healingAura } from "../phantasias/healing-aura.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { whirlwindVizier } from "./whirlwind-vizier.ts";

/** @covers 5swaf8urrq-a1 */
describe("Whirlwind Vizier — Class Bonus life", () => {
  for (const classBonus of [false, true]) {
    it(`has ${classBonus ? 3 : 2} life with Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        whirlwindVizier,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [whirlwindVizier] } },
        playerTwo: { champion, zones: { field: [automatedGardener, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const vizier = player.card(whirlwindVizier);
      opponent.declareAttack(automatedGardener, vizier);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(whirlwindVizier, { zone: "field" })).toHaveLength(classBonus ? 1 : 0);
      if (classBonus) {
        expect(game.state.objects[vizier.objectId]!.damage).toBe(2);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
          game.player(wait.playerId).pass();
        opponent.declareAttack(woodlandSquirrels, vizier);
        game.resolveCombatWithoutRetaliation();
      }
      expect(player.zone("graveyard")).toEqual([vizier]);
    });
  }
});

function setupAbility() {
  const champion = createClassBonusTestChampion(whirlwindVizier, false, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [whirlwindVizier, healingAura, fractalOfSnow, woodlandSquirrels],
        hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [healingAura, fractalOfSnow, woodlandSquirrels] } },
  });
}

/** @covers 5swaf8urrq-a2 */
describe("Whirlwind Vizier — paid sacrifice destroys non-Fractal Phantasias", () => {
  for (const targetOwner of ["player-one", "player-two"] as const) {
    it(`destroys ${targetOwner}'s non-Fractal Phantasia`, () => {
      const game = setupAbility();
      const player = game.player("player-one");
      const targetPlayer = game.player(targetOwner);
      const source = player.card(whirlwindVizier);
      const target = targetPlayer.card(healingAura);
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      player.activateAbility(source, "5swaf8urrq-a2", {
        targets: { "target-1": [target.objectId] },
        reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      expect(player.zone("memory")).toEqual(payment);
      expect(player.zone("graveyard")).toEqual([source]);
      expect(targetPlayer.cards(healingAura, { zone: "field" })).toEqual([target]);
      passEffectsStack(game);
      expect(targetPlayer.zone("graveyard")).toEqual(
        targetOwner === "player-one" ? [source, target] : [target],
      );
      expect(player.cards(whirlwindVizier, { zone: "field" })).toHaveLength(0);
    });
  }

  for (const invalid of [
    "own-fractal",
    "opponent-fractal",
    "own-ally",
    "opponent-ally",
    "source",
  ] as const) {
    it(`rejects ${invalid} before paying or sacrificing`, () => {
      const game = setupAbility();
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const source = player.card(whirlwindVizier);
      const target =
        invalid === "own-fractal"
          ? player.card(fractalOfSnow)
          : invalid === "opponent-fractal"
            ? opponent.card(fractalOfSnow)
            : invalid === "own-ally"
              ? player.card(woodlandSquirrels, { zone: "field" })
              : invalid === "opponent-ally"
                ? opponent.card(woodlandSquirrels)
                : source;
      const before = game.state;
      expect(() =>
        player.activateAbility(source, "5swaf8urrq-a2", {
          targets: { "target-1": [target.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card", cardId: card.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }

  it("rejects reserve underpayment without resting or sacrificing", () => {
    const game = setupAbility();
    const player = game.player("player-one");
    const source = player.card(whirlwindVizier);
    const before = game.state;
    expect(() =>
      player.activateAbility(source, "5swaf8urrq-a2", {
        targets: { "target-1": [player.card(healingAura).objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
