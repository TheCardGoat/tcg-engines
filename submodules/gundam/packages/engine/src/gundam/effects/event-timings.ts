/**
 * Single source of truth for the mapping between engine trigger events and
 * the effect-timing strings those events activate.
 *
 * Constant effects do not consume this map; any effect with an event timing
 * must be encoded as `type: "triggered"`.
 */

/**
 * Game-event-type → effect-timing string(s) accepted by matching
 * triggered effects.
 */
export const EVENT_TIMING_MAP: Record<string, readonly string[]> = {
  unitDeployed: ["deploy"],
  baseDeployed: ["deploy"],
  attackDeclared: ["attack"],
  unitDestroyed: ["destroyed"],
  shieldDestroyed: ["burst"],
  pilotPaired: ["whenPaired", "whenLinked"],
  unitBlocked: ["onBlocked"],
  unitHealed: ["whenHealed"],
  anyEffectDamageReceived: ["onEffectDamageReceived"],
  restedByEffect: ["onRestedByEffect", "onRestedByEnemyEffect"],
  setActiveByEffect: ["onSetActiveByEffect"],
  unitEffectCostPaid: ["onUnitEffectCostPaid"],
  effectDamageReceived: ["onEnemyEffectDamage"],
  apReducedByEnemy: ["onApReducedByEnemy"],
  exResourcePlaced: ["onExResourcePlaced"],
  enemyLinkUnitDestroyed: ["onEnemyLinkUnitDestroyed"],
  battleDamageReceived: ["onBattleDamageReceived"],
  battleDamageDealtToUnit: ["onBattleDamageDealtToUnit"],
  drawByEffect: ["onDrawByEffect"],
  supportUsed: ["onSupportUsed"],
  commandEffectActivated: ["onCommandEffectActivated"],
  turnEnded: ["endOfTurn"],
  /**
   * Fired on the *attacker* when its battle damage destroys the defender.
   * Distinct from `unitDestroyed` (fired on the dying card) so card text
   * like "when this Unit destroys an enemy Unit with battle damage" can
   * key on the attacker side without observers on the dying side firing.
   */
  attackerDestroyedDefender: ["onDestroyByBattle"],
  shieldAreaCardDestroyedByBattle: ["onShieldAreaCardDestroyByBattle"],
};
