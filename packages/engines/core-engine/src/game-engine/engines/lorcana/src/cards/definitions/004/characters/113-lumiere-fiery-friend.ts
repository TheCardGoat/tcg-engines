import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { yourOtherCharactersGet } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lumiereFieryFriend: LorcanitoCharacterCardDefinition = {
  id: "tok",
  reprints: ["bk1"],
  name: "Lumiere",
  title: "Fiery Friend",
  characteristics: ["dreamborn", "ally"],
  text: "**FERVENT ADDRESS** Your other characters get +1 {S}.",
  type: "character",
  abilities: [
    yourOtherCharactersGet({
      name: "Fervent Address",
      text: "Your other characters get +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          target: yourOtherCharacters,
        },
      ],
    }),
  ],
  flavour:
    "The invaders are at our gates, mes amis! It's time to show them what we're made of.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Valentin Palombo",
  number: 113,
  set: "URR",
  rarity: "rare",
};
