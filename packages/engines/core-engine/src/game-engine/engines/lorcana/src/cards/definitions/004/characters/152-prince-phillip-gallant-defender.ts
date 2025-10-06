import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipGallantDefender: LorcanitoCharacterCardDefinition = {
  id: "emu",
  missingTestCase: true,
  name: "Prince Phillip",
  title: "Gallant Defender",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_\n\n \n**BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_",
  type: "character",
  abilities: [
    supportAbility,
    {
      name: "**BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_",
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Mike Parker",
  number: 152,
  set: "URR",
  rarity: "rare",
};
