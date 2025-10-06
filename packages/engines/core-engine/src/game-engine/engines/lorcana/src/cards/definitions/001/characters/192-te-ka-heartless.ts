import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const teKaHeartless: LorcanitoCharacterCardDefinition = {
  id: "pfr",
  name: "Te Ka",
  title: "Heartless",
  characteristics: ["dreamborn", "villain", "deity"],
  text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: self,
        },
      ],
    }),
  ],
  flavour: "Maui: Ever defeat a lava monster? \nMoana: No. Have you?",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Andrew Trabbold",
  number: 192,
  set: "TFC",
  rarity: "legendary",
};
