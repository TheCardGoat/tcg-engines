import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flynnRiderCharmingRogue: LorcanitoCharacterCardDefinition = {
  id: "pth",
  name: "Flynn Rider",
  title: "Charming Rogue",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**HERE COMES THE SMOLDER** Whenever this character is challenged, the challenging player chooses and discards a card.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "Here Comes The Smolder",
      text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
      responder: "opponent",
      effects: [discardACard],
    }),
  ],
  flavour:
    "I didn't want to have to do this, but you leave me no choice. . . .",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Leonardo Giammichele",
  number: 74,
  set: "TFC",
  rarity: "uncommon",
};
