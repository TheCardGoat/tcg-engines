import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { savageArrow } from "../cards/AMB/items/savage-arrow.ts";
import { savageAttack } from "../cards/AMB/attacks/savage-attack.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { classBonusLeveledChampion, printedWeaponPower } from "./class-bonus-level.ts";
import { passEffectsStack } from "./decisions.ts";

function loadBow(
  game: GrandArchiveTestEngine,
  bow: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  const player = game.player("player-one");
  player.activateAbility(savageArrow, "uuty5scwug-a1", {
    targets: { "target-weapon": [player.card(bow, { zone: "field" }).objectId] },
  });
  passEffectsStack(game);
}

/** Bow is card-specific: prove it must be loaded to attack and cannot join an attack card. */
export function proveBowMustBeLoaded({
  card,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  const power = printedWeaponPower(card);

  function setup() {
    const { starter, lineage } = classBonusLeveledChampion(card, true, 0);
    return GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage,
        zones: {
          field: [card, savageArrow],
          hand: [savageAttack, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion: starter },
    });
  }

  it("cannot be used for an attack while unloaded", () => {
    const game = setup();
    const player = game.player("player-one");
    const { starter } = classBonusLeveledChampion(card, true, 0);
    const before = game.state;
    expect(() =>
      player.declareAttack(
        player.card(starter, { zone: "field" }),
        game.player("player-two").card(starter, { zone: "field" }),
        { weaponIds: [player.card(card, { zone: "field" }).objectId] },
      ),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  it("attacks only after it is loaded and cannot join an attack card", () => {
    const game = setup();
    const player = game.player("player-one");
    const { starter } = classBonusLeveledChampion(card, true, 0);
    const attacker = player.card(starter, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const weapon = player.card(card, { zone: "field" });
    loadBow(game, card);
    player.declareAttack(attacker, target, { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(power + 3);

    const second = setup();
    const secondPlayer = second.player("player-one");
    const secondAttacker = secondPlayer.card(starter, { zone: "field" });
    const secondTarget = second.player("player-two").card(starter, { zone: "field" });
    const secondWeapon = secondPlayer.card(card, { zone: "field" });
    loadBow(second, card);
    secondPlayer.activate(savageAttack, {
      attackAttackerId: secondAttacker.objectId,
      reservePayment: secondPlayer
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(second);
    const withBow = secondPlayer
      .legalCommands()
      .some(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "weaponIds" in candidate.command.answer &&
          Array.isArray(candidate.command.answer.weaponIds) &&
          candidate.command.answer.weaponIds.includes(secondWeapon.objectId),
      );
    expect(withBow).toBe(false);
    secondPlayer.executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "attackerId" in candidate.command.answer &&
        candidate.command.answer.attackerId === secondAttacker.objectId &&
        !("delegatePlayerId" in candidate.command.answer) &&
        (!("weaponIds" in candidate.command.answer) ||
          (Array.isArray(candidate.command.answer.weaponIds) &&
            candidate.command.answer.weaponIds.length === 0)) &&
        "targetIds" in candidate.command.answer &&
        Array.isArray(candidate.command.answer.targetIds) &&
        candidate.command.answer.targetIds.length === 1 &&
        candidate.command.answer.targetIds.includes(secondTarget.objectId),
      "declare Savage Attack without the Bow",
    );
    second.resolveCombatWithoutRetaliation();
    expect(second.state.objects[secondTarget.objectId]!.damage).toBe(2);
  });
}
