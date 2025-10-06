// TODO: Once the set is released, we organize the cards by set and type

import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { thisCard } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liloEscapeArtist: LorcanaCharacterCardDefinition = {
  id: "eti",
  name: "Lilo",
  title: "Escape Artist",
  characteristics: ["storyborn", "hero"],
  text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
  type: "character",
  abilities: [
    atTheStartOfYourTurn({
      name: "No Place I’d Rather Be",
      text: "At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
      optional: true,
      doesItTriggerFromDiscard: true,
      conditions: [
        {
          type: "filter",
          filters: [...thisCard.filters, { filter: "zone", value: "discard" }],
          comparison: { operator: "eq", value: 1 },
        },
      ],
      effects: [
        {
          type: "play",
          forFree: false,
          exerted: true,
          target: thisCard,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Grzegorz Krysiński",
  number: 2,
  set: "006",
  rarity: "super_rare",
};
