import { youHaveLocationInPlay } from "@lorcanito/lorcana-engine/abilities/conditions";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fixitFelixJrDelightedSightseer: LorcanitoCharacterCardDefinition =
  {
    id: "m45",
    name: "Fix‐It Felix, Jr.",
    title: "Delighted Sightseer",
    characteristics: ["hero", "storyborn"],
    text: "**OH, MY LAND!** When you play this character, if you have a location in play, draw a card.",
    type: "character",
    abilities: [
      whenYouPlayThis({
        name: "OH, MY LAND!",
        text: "When you play this character, if you have a location in play, draw a card.",
        conditions: [youHaveLocationInPlay],
        effects: [drawACard],
      }),
    ],
    flavour: "I don't think I've ever seen anything as sweet as this.",
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    strength: 1,
    willpower: 3,
    lore: 1,
    illustrator: "Cristian Romero",
    number: 17,
    set: "SSK",
    rarity: "common",
  };
