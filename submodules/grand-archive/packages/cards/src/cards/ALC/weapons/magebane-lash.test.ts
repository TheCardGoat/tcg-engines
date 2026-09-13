import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { condensedSupernova } from "../items/condensed-supernova.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { magebaneLash } from "./magebane-lash.ts";
import { deployGunshield } from "../actions/deploy-gunshield.ts";

function reachMain(game: GrandArchiveTestEngine) {
  for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected phase ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}

/** @covers oh300z2sns-a1 @covers oh300z2sns-a2 */
describe("Magebane Lash — entry counters and current power", () => {
  it("updates an existing Lash for a second counter, counting only its controller's champion", () => {
    const champion = createClassBonusTestChampion(magebaneLash, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [magebaneLash, magebaneLash],
          graveyard: [deployGunshield, deployGunshield],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          "material-deck": [magebaneLash],
          graveyard: [deployGunshield],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attacker = player.card(champion, { zone: "field" });
    const target = opponent.card(champion, { zone: "field" });
    const first = player.cards(magebaneLash, { zone: "material-deck" })[0]!;
    player.materialize(first, { floatingMemoryCardIds: [player.zone("graveyard")[0]!.objectId] });
    passEffectsStack(game);
    expect(game.state.objects[attacker.objectId]!.counters["named:lash"]).toBe(1);
    for (const next of [opponent, player]) {
      for (let step = 0; step < 128; step++) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice") break;
        if (wait.kind !== "opportunity") throw new Error(`Unexpected turn state ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      next.materialize(magebaneLash, {
        floatingMemoryCardIds: [next.zone("graveyard")[0]!.objectId],
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[attacker.objectId]!.counters["named:lash"]).toBe(2);
    expect(game.state.objects[target.objectId]!.counters["named:lash"]).toBe(1);
    reachMain(game);
    player.declareAttack(attacker, target, { weaponIds: [first.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
  for (const classBonus of [false, true]) {
    it(`adds its counter on separate entry resolution with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        magebaneLash,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            memory: [woodlandSquirrels],
            "material-deck": [magebaneLash],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [magebaneLash], "main-deck": [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(champion, { zone: "field" });
      const target = opponent.card(champion, { zone: "field" });
      player.materialize(magebaneLash);
      expect(game.state.objects[attacker.objectId]!.counters["named:lash"] ?? 0).toBe(0);
      player.pass();
      opponent.pass();
      expect(player.cards(magebaneLash, { zone: "field" })).toHaveLength(1);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "oh300z2sns-a1",
        ),
      ).toBe(classBonus);
      expect(game.state.objects[attacker.objectId]!.counters["named:lash"] ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[attacker.objectId]!.counters["named:lash"] ?? 0).toBe(
        classBonus ? 1 : 0,
      );
      expect(game.state.objects[target.objectId]!.counters["named:lash"] ?? 0).toBe(0);
      reachMain(game);
      const weapon = player.card(magebaneLash, { zone: "field" });
      player.declareAttack(attacker, target, { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 1 : 0);
    });
  }
});

/** @covers oh300z2sns-a3 */
describe("Magebane Lash — Nico non-combat recovery", () => {
  for (const nico of [false, true]) {
    for (const damage of [0, 1, 2, 3]) {
      it(`recovers after ${damage} non-combat damage with Nico ${nico}`, () => {
        const champion = lineageTestChampion(nico ? "Nico" : "Other", 0);
        const defender = lineageTestChampion("Defender", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            lineage: Array.from({ length: damage }, (_, index) =>
              lineageTestChampion(nico ? "Nico" : "Other", index + 1),
            ),
            zones: {
              field: [magebaneLash, condensedSupernova, supplyDrone],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: defender },
        });
        const player = game.player("player-one");
        const target = player.card(champion, { zone: "field" });
        const opposing = game.player("player-two").card(defender, { zone: "field" });
        const ally = player.card(supplyDrone, { zone: "field" });
        const deck = player.zone("main-deck");
        player.activateAbility(condensedSupernova, "14m4c8ljye-a2");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: deck.map((ref) => ref.objectId),
          bottom: [],
        });
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "oh300z2sns-a3",
          ),
        ).toBe(nico && damage > 0);
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(
          nico ? Math.max(0, damage - 2) : damage,
        );
        expect(game.state.objects[opposing.objectId]!.damage).toBe(damage);
        expect(game.state.objects[ally.objectId]!.damage).toBe(damage);
      });
    }
  }
  it("does not recover when Nico takes combat damage", () => {
    const champion = lineageTestChampion("Nico", 0);
    const opponentChampion = lineageTestChampion("Other", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [magebaneLash] } },
      playerTwo: { champion: opponentChampion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const target = player.card(champion, { zone: "field" });
    game.player("player-two").declareAttack(automatedGardener, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(game.state.stack).toHaveLength(0);
  });
});
