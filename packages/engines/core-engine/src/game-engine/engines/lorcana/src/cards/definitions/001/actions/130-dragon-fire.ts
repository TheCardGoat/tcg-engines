import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";

export const dragonFire: LorcanitoActionCard = {
  id: "buy",
  name: "Dragon Fire",
  characteristics: ["action"],
  text: "Banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Dragon Fire",
      text: "Banish chosen character.",
      effects: [mayBanish(chosenCharacter)],
    },
  ],
  flavour: "Rare is the hero who can withstand a dragon's wrath.",
  colors: ["ruby"],
  cost: 5,
  illustrator: "Luis Huerta",
  number: 130,
  set: "TFC",
  rarity: "uncommon",
};
