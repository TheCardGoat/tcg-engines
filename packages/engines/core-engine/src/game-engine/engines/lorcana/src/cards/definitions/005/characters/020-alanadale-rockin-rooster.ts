import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const alanadaleRockinRooster: LorcanaCharacterCardDefinition = {
  id: "srn",
  missingTestCase: true,
  name: "Alan-a-Dale",
  title: "Rockin' Rooster",
  characteristics: ["storyborn", "ally"],
  text: "**FAN FAVORITE** Whenever you play a song, gain 1 lore.",
  type: "character",
  abilities: [
    wheneverYouPlayASong({
      name: "Fan Favotire",
      text: "whenever you play a song, gain 1 lore.",
      effects: [youGainLore(1)],
    }),
  ],
  flavour:
    "Thank you! Now here's a little ditty for our floodborn friends that we call 'Martin and the Flood'.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "John Loren",
  number: 20,
  set: "SSK",
  rarity: "uncommon",
};
