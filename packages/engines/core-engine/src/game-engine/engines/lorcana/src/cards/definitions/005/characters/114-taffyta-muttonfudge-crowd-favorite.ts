import { youHaveLocationInPlay } from "@lorcanito/lorcana-engine/abilities/conditions";
import { eachOpponentLosesXLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const taffytaMuttonfudgeCrowdFavorite: LorcanitoCharacterCardDefinition =
  {
    id: "a55",
    name: "Taffyta Muttonfudge",
    title: "Crowd Favorite",
    characteristics: ["storyborn", "ally", "racer"],
    text: "**SHOWSTOPPER** When you play this character, if you have a location in play, each opponent loses 1 lore.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "Showstopper",
        text: "When you play this character, if you have a location in play, each opponent loses 1 lore.",
        resolutionConditions: [youHaveLocationInPlay],
        effects: [eachOpponentLosesXLore(1)],
      },
    ],
    flavour: '"Never lose sight of where you\'re going. Second place."',
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    strength: 1,
    willpower: 2,
    lore: 1,
    illustrator: "Carlos Luzzi",
    number: 114,
    set: "SSK",
    rarity: "common",
  };
