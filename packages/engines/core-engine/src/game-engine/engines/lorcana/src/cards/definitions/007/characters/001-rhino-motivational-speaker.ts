import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { yourOtherCharactersGet } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rhinoMotivationalSpeaker: LorcanaCharacterCardDefinition = {
  id: "jwn",
  name: "Rhino",
  title: "Motivational Speaker",
  characteristics: ["storyborn", "ally"],
  text: "DESTINY CALLING Your other characters get +2 {W}.",
  type: "character",
  abilities: [
    yourOtherCharactersGet({
      name: "DESTINY CALLING",
      text: "Your other characters get +2 {W}.",
      effects: [
        {
          type: "attribute",
          attribute: "willpower",
          amount: 2,
          modifier: "add",
          target: yourOtherCharacters,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber", "steel"],
  cost: 6,
  strength: 4,
  willpower: 7,
  illustrator: "Stefano Zanchi",
  number: 1,
  set: "007",
  rarity: "rare",
  lore: 2,
};
