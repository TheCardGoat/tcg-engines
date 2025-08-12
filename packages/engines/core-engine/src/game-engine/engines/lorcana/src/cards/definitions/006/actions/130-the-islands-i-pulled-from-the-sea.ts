import { searchDeckEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theIslandsIPulledFromTheSea: LorcanaActionCardDefinition = {
  id: "bnu",
  missingTestCase: true,
  name: "The Islands I Pulled From The Sea",
  characteristics: ["action", "song"],
  text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
      effects: [
        searchDeckEffect({
          cardType: "location",
          reveal: true,
          toZone: "hand",
          shuffle: true,
          targets: [selfPlayerTarget],
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  strength: 0,
  illustrator: "Wietse Treurniet",
  number: 130,
  set: "006",
  rarity: "uncommon",
};
