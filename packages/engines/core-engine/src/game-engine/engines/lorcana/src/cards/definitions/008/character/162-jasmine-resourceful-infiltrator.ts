import { anotherChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineResourcefulInfiltrator: LorcanaCharacterCardDefinition = {
  id: "sc0",
  name: "Jasmine",
  title: "Resourceful Infiltrator",
  characteristics: ["storyborn", "hero", "princess"],
  text: "JUST WHAT YOU NEED When you play this character, you may give another chosen character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "JUST WHAT YOU NEED",
      text: "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
      optional: true,
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: anotherChosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Joseph Buenning",
  number: 162,
  set: "008",
  rarity: "common",
  lore: 1,
};
