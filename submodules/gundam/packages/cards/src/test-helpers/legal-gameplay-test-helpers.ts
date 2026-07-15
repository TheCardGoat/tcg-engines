import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, expectSuccess } from "@tcg/gundam-engine";

type TestPlayerId = typeof PLAYER_ONE | typeof PLAYER_TWO;

function opponentOf(playerId: TestPlayerId): TestPlayerId {
  return playerId === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

/** Rest Units through ordinary direct attacks, fully resolving each battle. */
export function restUnitsByAttackingDirectly(
  engine: GundamTestEngine,
  playerId: TestPlayerId,
  attackerIds: readonly string[],
): void {
  const attacker = engine.asPlayer(playerId);
  const defender = engine.asPlayer(opponentOf(playerId));

  for (const attackerId of attackerIds) {
    expectSuccess(attacker.enterBattle(attackerId, "direct"));
    expectSuccess(defender.passBlock());
    expectSuccess(defender.passBattleAction());
    expectSuccess(attacker.passBattleAction());
  }
}

/** Finish the active player's Main/End sequence through normal pass moves. */
export function passTurnThroughPublicMoves(
  engine: GundamTestEngine,
  activePlayerId: TestPlayerId,
): void {
  const activePlayer = engine.asPlayer(activePlayerId);
  const standbyPlayer = engine.asPlayer(opponentOf(activePlayerId));

  expectSuccess(activePlayer.passPhase());
  expectSuccess(standbyPlayer.passActionStep());
  expectSuccess(activePlayer.passActionStep());
}

/** Resolve a normal Unit-vs-Unit battle with no Blocker or Action effects. */
export function resolveUnitBattle(
  engine: GundamTestEngine,
  attackerPlayerId: TestPlayerId,
  attackerId: string,
  defenderId: string,
): void {
  const attacker = engine.asPlayer(attackerPlayerId);
  const defender = engine.asPlayer(opponentOf(attackerPlayerId));

  expectSuccess(attacker.enterBattle(attackerId, defenderId));
  expectSuccess(defender.passBlock());
  expectSuccess(defender.passBattleAction());
  expectSuccess(attacker.passBattleAction());
}
