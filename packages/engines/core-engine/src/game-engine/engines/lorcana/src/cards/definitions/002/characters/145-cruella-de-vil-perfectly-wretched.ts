import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cruellaDeVilPerfectlyWretched: LorcanaCharacterCardDefinition = {
  id: "l1b",

  name: "Cruella De Vil",
  title: "Perfectly Wretched",
  characteristics: ["floodborn", "villain"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil._)\n**OH, NO YOU DON'T** Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
  type: "character",
  abilities: [
    shiftAbility(3, "cruella de vil"),
    wheneverQuests({
      name: "Oh, No You Don't",
      text: "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  flavour: "It's ink couture, darling. I wear only the best!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "GusGadget / Leonardo Giammichele",
  number: 145,
  set: "ROF",
  rarity: "uncommon",
};
