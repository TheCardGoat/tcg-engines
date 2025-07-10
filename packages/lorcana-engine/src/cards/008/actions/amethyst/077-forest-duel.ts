import type {
  AbilityEffect,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";

const gainsChallenger: AbilityEffect = {
  type: "ability",
  ability: "challenger",
  amount: 2,
  modifier: "add",
  duration: "turn",
  target: yourCharacters,
};

const gainsReturnToHand: AbilityEffect = {
  type: "ability",
  ability: "custom",
  modifier: "add",
  duration: "turn",
  customAbility: whenThisCharacterBanishedInAChallenge({
    effects: [
      {
        type: "move",
        to: "hand",
        target: {
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "self" }],
        },
      },
    ],
  }),
  target: yourCharacters,
};

export const forestDuel: LorcanitoActionCard = {
  id: "m3x",
  name: "Forest Duel",
  characteristics: ["action"],
  text: "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [gainsChallenger, gainsReturnToHand],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "Yr Tanner",
  number: 77,
  set: "008",
  rarity: "uncommon",
};
