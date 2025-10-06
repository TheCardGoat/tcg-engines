// TODO: Once the set is released, we organize the cards by set and type

import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverACharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckPirateCaptain: LorcanaCharacterCardDefinition = {
  id: "zbi",
  name: "Daisy Duck",
  title: "Pirate Captain",
  characteristics: ["dreamborn", "hero", "pirate", "captain"],
  text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
  type: "character",
  abilities: [
    wheneverACharacterQuests({
      name: "Distant Shores",
      text: "Whenever one of your Pirate characters quests while at a location, draw a card.",
      optional: false,
      effects: [drawACard],
      characterFilter: [
        { filter: "characteristics", value: ["pirate"] },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
        { filter: "status", value: "at-location" },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Jochem van Gool",
  number: 81,
  set: "006",
  rarity: "super_rare",
};
