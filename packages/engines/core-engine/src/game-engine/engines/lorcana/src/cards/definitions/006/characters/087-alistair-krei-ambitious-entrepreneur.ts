// TODO: Once the set is released, we organize the cards by set and type

import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const alistairKreiAmbitiousEntrepreneur: LorcanitoCharacterCardDefinition =
  {
    id: "v7y",
    missingTestCase: true,
    name: "Alistair Krei",
    title: "Ambitious Entrepreneur",
    characteristics: ["storyborn", "inventor"],
    text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "An Eye For Tech",
        text: "When you play this character, if an opponent has an item in play, gain 1 lore.",
        effects: [youGainLore(1)],
      },
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 3,
    strength: 2,
    willpower: 4,
    lore: 1,
    illustrator: "Diogo Saito",
    number: 87,
    set: "006",
    rarity: "common",
  };
