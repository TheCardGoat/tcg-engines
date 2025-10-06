import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const noiAcrobaticBaby: LorcanitoCharacterCardDefinition = {
  id: "fk2",
  missingTestCase: true,
  name: "Noi",
  title: "Acrobatic Baby",
  characteristics: ["storyborn", "ally"],
  text: "**FANCY FOOTWORK** Whenever you play an action, this character takes no damage from challenges this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "Fancy Footwork",
      text: "Whenever you play an action, this character takes no damage from challenges this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        // Implementation would need special protection effect here
      ],
    }),
  ],
  flavour: "Fortune favors the bold - no matter how small.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  illustrator: "Denny Minonne",
  number: 119,
  set: "URR",
  rarity: "super_rare",
};
