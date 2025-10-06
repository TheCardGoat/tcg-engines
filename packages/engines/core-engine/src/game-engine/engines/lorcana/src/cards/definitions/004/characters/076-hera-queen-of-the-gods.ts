import {
  evasiveAbility,
  wardAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heraQueenOfTheGods: LorcanaCharacterCardDefinition = {
  id: "qp0",
  name: "Hera",
  title: "Queen of the Gods",
  characteristics: ["queen", "storyborn", "deity"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n**PROTECTIVE GODDESS** Your characters named Zeus gain **Ward**.\n\n\n**YOU'RE A TRUE HERO** Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_",
  type: "character",
  abilities: [
    wardAbility,
    yourOtherCharactersWithGain({
      name: "Protective Goddess",
      text: "Your characters named Zeus gain **Ward**.",
      gainedAbility: wardAbility,
      filter: {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "Zeus" },
      },
    }),
    yourOtherCharactersWithGain({
      name: "You're a True Hero",
      text: "Your characters named Hercules gain **Evasive**. _(Only characters with Evasive can challenge them.)_",
      gainedAbility: evasiveAbility,
      filter: {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "Hercules" },
      },
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Raquel Villanueva",
  number: 76,
  set: "URR",
  rarity: "rare",
};
