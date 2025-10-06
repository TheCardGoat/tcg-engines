import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const anitaRadcliffeDogLover: LorcanaCharacterCardDefinition = {
  id: "cir",
  name: "Anita Radcliffe",
  title: "Dog Lover",
  characteristics: ["storyborn", "ally"],
  text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "I'LL TAKE CARE OF YOU",
      text: "When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
      optional: true,
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "characteristics", value: ["puppy"] },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
        ],
      },
      effects: [chosenCharacterGainsResist(1, "next_turn")],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Carmine Pucci",
  number: 155,
  set: "008",
  rarity: "common",
  lore: 1,
};
