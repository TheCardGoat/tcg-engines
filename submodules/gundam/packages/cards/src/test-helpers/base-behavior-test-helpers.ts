import type { BaseCard } from "@tcg/gundam-types";
import { expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";

function resolvePendingTargetAndOptionalChoices(
  player: ReturnType<GundamTestEngine["asPlayer"]>,
): void {
  for (let index = 0; index < 10; index += 1) {
    const choice = player.getBoardView().pendingChoice;
    if (!choice) return;
    if (choice.kind === "optional") {
      expectSuccess(player.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: true } }));
      continue;
    }
    if (choice.kind === "targetSelection") {
      const targets =
        choice.groups.length > 0
          ? choice.groups.flatMap((group) => group.legalTargetIds.slice(0, group.minTargets))
          : choice.legalTargetIds.slice(0, choice.minTargets);
      expectSuccess(
        player.resolveEffect({
          ...(choice.optionalDirectiveIndex === undefined
            ? {}
            : { optionalAnswers: { [choice.optionalDirectiveIndex]: true } }),
          targets,
        }),
      );
      continue;
    }
    throw new Error(`Unexpected ${choice.kind} choice while resolving a Base ability`);
  }
  throw new Error("Base ability did not finish after ten public choice moves");
}

export function expectBaseBurstAndDeployAbilities(card: BaseCard): void {
  const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
  const friendlyBlueUnit = createMockUnit({
    name: "Friendly Blue G Generation Unit",
    color: "blue",
    traits: ["g generation"],
    hp: 4,
  });
  const friendlyWhiteUnit = createMockUnit({
    name: "Friendly White G Generation Unit",
    color: "white",
    traits: ["g generation"],
    hp: 4,
  });
  const enemyUnit = createMockUnit({
    name: "Enemy G Generation Unit",
    color: "blue",
    traits: ["g generation"],
    hp: 4,
  });
  const burstEngine = GundamTestEngine.create(
    { play: [attacker, enemyUnit] },
    {
      play: [friendlyBlueUnit, { card: friendlyWhiteUnit, exhausted: true }],
      shieldArea: [card, createMockUnit({ name: "Remaining Shield" })],
    },
  );
  const attackerPlayer = burstEngine.asPlayer(PLAYER_ONE);
  const defendingPlayer = burstEngine.asPlayer(PLAYER_TWO);
  const attackerId = attackerPlayer.getCardsInZone("battleArea")[0]!;

  expectSuccess(attackerPlayer.enterBattle(attackerId, "direct"));
  expectSuccess(defendingPlayer.passBlock());
  expectSuccess(defendingPlayer.passBattleAction());
  expectSuccess(attackerPlayer.passBattleAction());
  const burst = defendingPlayer.getBoardView().pendingChoice;
  if (burst?.kind !== "optional") {
    throw new Error(`Expected ${card.cardNumber}'s visible Burst choice`);
  }
  const revealedId = burst.sourceCardId;
  expect(burst).toMatchObject({
    controllerId: PLAYER_TWO,
    prompt: "【Burst】Deploy this card.",
  });

  expectSuccess(
    defendingPlayer.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }),
  );
  resolvePendingTargetAndOptionalChoices(defendingPlayer);

  expect(defendingPlayer.getCardZone(revealedId)).toBe(`baseSection:${PLAYER_TWO}`);
  expect(defendingPlayer.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
  expect(defendingPlayer.getHand()).toHaveLength(1);

  const deployEngine = GundamTestEngine.create(
    {
      hand: [card],
      play: [friendlyBlueUnit, { card: friendlyWhiteUnit, exhausted: true }],
      shieldArea: [
        createMockUnit({ name: "First Shield" }),
        createMockUnit({ name: "Second Shield" }),
      ],
      resourceArea: activeResources(Math.max(card.level, card.cost)),
    },
    { play: [enemyUnit] },
  );
  const deployingPlayer = deployEngine.asPlayer(PLAYER_ONE);
  const baseId = deployingPlayer.getHand()[0]!;

  expectSuccess(deployingPlayer.deployBase(baseId));
  resolvePendingTargetAndOptionalChoices(deployingPlayer);

  expect(deployingPlayer.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
  expect(deployingPlayer.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
  expect(deployingPlayer.getHand()).toHaveLength(1);
}
