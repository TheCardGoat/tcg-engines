import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckBuccaneer: LorcanitoCharacterCardDefinition = {
  id: "vz0",
  name: "Donald Duck",
  title: "Buccaneer",
  characteristics: ["hero", "dreamborn", "pirate", "captain"],
  text: "**BOARDING PARTY** During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "BOARDING PARTY",
      text: "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "Nobody stands a chance against the daring duck of the high seas!",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Federico M. Cugliari",
  number: 179,
  set: "URR",
  rarity: "legendary",
};
