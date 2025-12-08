/**
 * Example: Resolution Ability Implementation
 *
 * This example shows how to implement resolution abilities, which are
 * typically used for action cards and activated abilities.
 */

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/types";

// Example 1: Simple action card effect
// "Deal 3 damage to chosen character."
export const simpleAction: ResolutionAbility = {
  type: "resolution",
  name: "Simple Action",
  text: "Deal 3 damage to chosen character.",
  effects: [dealDamage(3, chosenCharacter)],
  target: chosenCharacter,
};

// Example 2: Multi-effect action
// "Draw 2 cards, then discard a card."
export const multiEffectAction: ResolutionAbility = {
  type: "resolution",
  name: "Multi Effect Action",
  text: "Draw 2 cards, then discard a card.",
  effects: [drawXCards(2), discardACard],
};

// Example 3: Optional effect action
// "Draw a card. You may discard a card to draw another card."
export const optionalAction: ResolutionAbility = {
  type: "resolution",
  name: "Optional Action",
  text: "Draw a card. You may discard a card to draw another card.",
  effects: [
    drawACard,
    (context) => {
      if (context.choices?.activateOptional) {
        context.player.discard(1);
        context.player.draw(1);
      }
    },
  ],
  optional: true,
};

// Example 4: Conditional action
// "If you have a character in play, deal 5 damage to chosen character. Otherwise, deal 2 damage."
export const conditionalAction: ResolutionAbility = {
  type: "resolution",
  name: "Conditional Action",
  text: "If you have a character in play, deal 5 damage to chosen character. Otherwise, deal 2 damage.",
  effects: [
    (context) => {
      const hasCharacter = countCharactersInPlay(context.playerId) > 0;
      const damage = hasCharacter ? 5 : 2;
      dealDamage(damage, context.target)(context);
    },
  ],
  target: chosenCharacter,
};

// Example 5: Banish effect action
// "Banish chosen item."
export const banishAction: ResolutionAbility = {
  type: "resolution",
  name: "Banish Action",
  text: "Banish chosen item.",
  effects: [banishChosenItem],
  target: chosenItem,
};

// Example 6: Return to hand action
// "Return chosen character to their player's hand."
export const returnAction: ResolutionAbility = {
  type: "resolution",
  name: "Return Action",
  text: "Return chosen character to their player's hand.",
  effects: [returnToHand(chosenCharacter)],
  target: chosenCharacter,
};

// Example 7: Mass effect action
// "Deal 1 damage to each opposing character."
export const massAction: ResolutionAbility = {
  type: "resolution",
  name: "Mass Action",
  text: "Deal 1 damage to each opposing character.",
  effects: [
    (context) => {
      this.game
        .getZone("play", context.opponentId)
        .filter((card) => card.type === "character")
        .forEach((card) => card.takeDamage(1));
    },
  ],
};

// Example 8: Stat modification action
// "Chosen character gets +3 strength this turn."
export const buffAction: ResolutionAbility = {
  type: "resolution",
  name: "Buff Action",
  text: "Chosen character gets +3 strength this turn.",
  effects: [chosenCharacterGetsStrength(3)],
  target: chosenCharacter,
};

// Example 9: Card manipulation action
// "Look at the top 3 cards of your deck. Put one into your hand and the rest on the bottom of your deck."
export const deckManipulation: ResolutionAbility = {
  type: "resolution",
  name: "Deck Manipulation",
  text: "Look at the top 3 cards of your deck. Put one into your hand and the rest on the bottom of your deck.",
  effects: [
    (context) => {
      const topCards = context.player.deck.slice(0, 3);
      const chosen = context.choices?.chosenCard;

      if (chosen) {
        context.player.moveCard(chosen, "deck", "hand");
        topCards
          .filter((card) => card.id !== chosen.id)
          .forEach((card) =>
            context.player.moveCard(card, "deck", "deck", {
              position: "bottom",
            }),
          );
      }
    },
  ],
};

// Example 10: Activated ability with cost
// "Exert this character: Draw a card."
export const activatedAbility: ResolutionAbility = {
  type: "resolution",
  name: "Activated Ability",
  text: "Exert this character: Draw a card.",
  costs: [() => this.exert()],
  effects: [drawACard],
};

// Example 11: Ink payment cost
// "Pay 2 ink: Chosen character gets +2 strength this turn."
export const inkCostAbility: ResolutionAbility = {
  type: "resolution",
  name: "Ink Cost Ability",
  text: "Pay 2 ink: Chosen character gets +2 strength this turn.",
  costs: [() => payInk(2, this.ownerId)],
  effects: [chosenCharacterGetsStrength(2)],
  target: chosenCharacter,
};

// Example 12: Banish cost ability
// "Banish this character: Deal 4 damage to chosen character."
export const banishCostAbility: ResolutionAbility = {
  type: "resolution",
  name: "Banish Cost Ability",
  text: "Banish this character: Deal 4 damage to chosen character.",
  costs: [() => this.banish()],
  effects: [dealDamage(4, chosenCharacter)],
  target: chosenCharacter,
};

// Example 13: Multiple targets action
// "Choose up to 2 characters. Each chosen character gets +1 strength this turn."
export const multiTargetAction: ResolutionAbility = {
  type: "resolution",
  name: "Multi Target Action",
  text: "Choose up to 2 characters. Each chosen character gets +1 strength this turn.",
  effects: [
    (context) => {
      context.targets?.forEach((target) => {
        target.modifyStrength(1, { duration: "turn" });
      });
    },
  ],
  target: upToXCharacters(2),
};

// Example 14: Search and play action
// "Search your deck for a character card with cost 3 or less and play it for free."
export const searchAndPlay: ResolutionAbility = {
  type: "resolution",
  name: "Search And Play",
  text: "Search your deck for a character card with cost 3 or less and play it for free.",
  effects: [
    (context) => {
      const validCards = context.player.deck.filter(
        (card) => card.type === "character" && card.cost <= 3,
      );

      if (validCards.length > 0 && context.choices?.chosenCard) {
        context.player.playCard(context.choices.chosenCard, {
          paymentType: "free",
        });
      }
    },
  ],
};

// Example 15: Modal choice action
// "Choose one: Deal 3 damage to chosen character; or draw 2 cards."
export const modalAction: ResolutionAbility = {
  type: "resolution",
  name: "Modal Action",
  text: "Choose one: Deal 3 damage to chosen character; or draw 2 cards.",
  effects: [
    (context) => {
      if (context.choices?.mode === "damage") {
        dealDamage(3, context.target)(context);
      } else if (context.choices?.mode === "draw") {
        drawXCards(2)(context);
      }
    },
  ],
  target: {
    type: "character",
    optional: true, // Only needed if damage mode is chosen
  },
};

// Example 16: Conditional target action
// "Deal 2 damage to chosen damaged character."
export const conditionalTargetAction: ResolutionAbility = {
  type: "resolution",
  name: "Conditional Target Action",
  text: "Deal 2 damage to chosen damaged character.",
  effects: [dealDamage(2, chosenCharacter)],
  target: {
    type: "character",
    filter: (card) => card.meta.damage > 0,
  },
};
