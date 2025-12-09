/**
 * Example: Continuous Ability Implementation
 *
 * This example shows how to implement continuous abilities that are
 * always active or active while certain conditions are met.
 */

import type { ContinuousAbility } from "@lorcanito/lorcana-engine/types";

// Example 1: Static keyword grant
// "This character has Support."
export const staticSupport: ContinuousAbility = {
  type: "continuous",
  name: "Static Support",
  text: "This character has Support.",
  effects: [() => this.addKeyword("support")],
};

// Example 2: Conditional keyword grant
// "While you have a character named Dale in play, this character gains Support."
export const conditionalSupport: ContinuousAbility = {
  type: "continuous",
  name: "Conditional Support",
  text: "While you have a character named Dale in play, this character gains Support.",
  conditions: [() => hasCharacterInPlay("Dale", this.ownerId)],
  effects: [() => this.addKeyword("support")],
};

// Example 3: Stat modification
// "While you have 3 or more characters in play, this character gets +2 strength."
export const conditionalStrength: ContinuousAbility = {
  type: "continuous",
  name: "Conditional Strength",
  text: "While you have 3 or more characters in play, this character gets +2 strength.",
  conditions: [() => countCharactersInPlay(this.ownerId) >= 3],
  effects: [() => this.modifyStrength(2)],
};

// Example 4: Multiple conditional effects
// "While you have a character named Mickey Mouse in play, this character gets +2 strength and gains Evasive."
export const multipleConditionalEffects: ContinuousAbility = {
  type: "continuous",
  name: "Multiple Conditional Effects",
  text: "While you have a character named Mickey Mouse in play, this character gets +2 strength and gains Evasive.",
  conditions: [() => hasCharacterInPlay("Mickey Mouse", this.ownerId)],
  effects: [() => this.modifyStrength(2), () => this.addKeyword("evasive")],
};

// Example 5: Cost reduction
// "Your characters with cost 5 or more cost 1 less to play."
export const costReduction: ContinuousAbility = {
  type: "continuous",
  name: "Cost Reduction",
  text: "Your characters with cost 5 or more cost 1 less to play.",
  effects: [
    () => {
      this.game
        .getZone("hand", this.ownerId)
        .filter((card) => card.type === "character" && card.cost >= 5)
        .forEach((card) => card.modifyCost(-1));
    },
  ],
};

// Example 6: Aura effect (affects other cards)
// "Your other characters get +1 strength."
export const auraStrength: ContinuousAbility = {
  type: "continuous",
  name: "Aura Strength",
  text: "Your other characters get +1 strength.",
  effects: [
    () => {
      this.game
        .getZone("play", this.ownerId)
        .filter((card) => card.type === "character" && card.id !== this.id)
        .forEach((card) => card.modifyStrength(1));
    },
  ],
};

// Example 7: Protection effect
// "Your characters can't be chosen by opposing abilities."
export const protection: ContinuousAbility = {
  type: "continuous",
  name: "Protection",
  text: "Your characters can't be chosen by opposing abilities.",
  effects: [
    () => {
      this.game
        .getZone("play", this.ownerId)
        .filter((card) => card.type === "character")
        .forEach((card) => card.addProtection("opposing-abilities"));
    },
  ],
};

// Example 8: Dynamic challenger bonus
// "While this character has 1 or more damage, it gains Challenger +2."
export const dynamicChallenger: ContinuousAbility = {
  type: "continuous",
  name: "Dynamic Challenger",
  text: "While this character has 1 or more damage, it gains Challenger +2.",
  conditions: [() => this.meta.damage > 0],
  effects: [() => this.addKeyword("challenger:+2")],
};

// Example 9: Lore modification
// "While you have 3 or more characters in play, this character gains +1 lore."
export const conditionalLore: ContinuousAbility = {
  type: "continuous",
  name: "Conditional Lore",
  text: "While you have 3 or more characters in play, this character gains +1 lore.",
  conditions: [() => countCharactersInPlay(this.ownerId) >= 3],
  effects: [() => this.modifyLore(1)],
};

// Example 10: Complex conditional with multiple requirements
// "While you have a character named Belle and a character named Beast in play, this character gets +3 strength and gains Rush."
export const complexConditional: ContinuousAbility = {
  type: "continuous",
  name: "Complex Conditional",
  text: "While you have a character named Belle and a character named Beast in play, this character gets +3 strength and gains Rush.",
  conditions: [
    () =>
      hasCharacterInPlay("Belle", this.ownerId) &&
      hasCharacterInPlay("Beast", this.ownerId),
  ],
  effects: [() => this.modifyStrength(3), () => this.addKeyword("rush")],
};

// Example 11: Turn-based condition
// "During your turn, this character gets +2 strength."
export const turnBasedBuff: ContinuousAbility = {
  type: "continuous",
  name: "Turn Based Buff",
  text: "During your turn, this character gets +2 strength.",
  conditions: [() => this.game.activePlayer === this.ownerId],
  effects: [() => this.modifyStrength(2)],
};

// Example 12: Opponent-based condition
// "While your opponent has 10 or more lore, this character gets +4 strength."
export const opponentLoreBuff: ContinuousAbility = {
  type: "continuous",
  name: "Opponent Lore Buff",
  text: "While your opponent has 10 or more lore, this character gets +4 strength.",
  conditions: [
    () => {
      const opponent = this.game.getOpponent(this.ownerId);
      return opponent.lore >= 10;
    },
  ],
  effects: [() => this.modifyStrength(4)],
};

// Example 13: Zone-based effect
// "While this card is in your inkwell, you may pay 1 less to play characters."
export const inkwellEffect: ContinuousAbility = {
  type: "continuous",
  name: "Inkwell Effect",
  text: "While this card is in your inkwell, you may pay 1 less to play characters.",
  conditions: [() => this.zone === "inkwell"],
  effects: [
    () => {
      this.game
        .getZone("hand", this.ownerId)
        .filter((card) => card.type === "character")
        .forEach((card) => card.modifyCost(-1));
    },
  ],
};

// Example 14: Counter-based effect
// "While this character has 3 or more +1/+1 counters, it gains Evasive."
export const counterBasedEffect: ContinuousAbility = {
  type: "continuous",
  name: "Counter Based Effect",
  text: "While this character has 3 or more +1/+1 counters, it gains Evasive.",
  conditions: [() => (this.meta.counters?.plusOneCounters || 0) >= 3],
  effects: [() => this.addKeyword("evasive")],
};
