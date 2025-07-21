import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Challenge one character with another
 * Implements Lorcana-specific challenge mechanics
 */
export function challengeCharacter(
  this: LorcanaCoreOperations,
  attackerId: string,
  defenderId: string,
): void {
  const attacker = this.getCardInstance(attackerId);
  const defender = this.getCardInstance(defenderId);

  // Get Lorcana-specific properties
  const attackerStrength = attacker.card.strength || 0;
  const attackerWillpower = attacker.card.willpower || 0;
  const defenderStrength = defender.card.strength || 0;
  const defenderWillpower = defender.card.willpower || 0;

  // Apply damage (Lorcana-specific rules)
  if (attackerStrength >= defenderWillpower) {
    // Defender is banished
    const defenderOwner = this.getCardOwner(defenderId);
    if (defenderOwner) {
      this.moveCard({
        playerId: defenderOwner,
        instanceId: defenderId,
        to: "discard",
      });
    }
  }

  if (defenderStrength >= attackerWillpower) {
    // Attacker is banished
    const attackerOwner = this.getCardOwner(attackerId);
    if (attackerOwner) {
      this.moveCard({
        playerId: attackerOwner,
        instanceId: attackerId,
        to: "discard",
      });
    }
  }

  // Both characters become exerted (update meta)
  this.exertCard(attackerId);
  this.exertCard(defenderId);
}
