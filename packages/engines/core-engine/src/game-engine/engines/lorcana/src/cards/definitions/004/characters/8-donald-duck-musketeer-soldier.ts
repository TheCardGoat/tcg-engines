import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckMusketeerSoldier: LorcanitoCharacterCardDefinition = {
  id: "xjt",
  name: "Donald Duck",
  title: "Musketeer Soldier",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n\n**WAIT FOR ME!** When you play this character, chosen character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      type: "resolution",
      name: "WAIT FOR ME!",
      text: "When you play this character, chosen character gets +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Jochem van Gool",
  number: 8,
  set: "URR",
  rarity: "uncommon",
};
