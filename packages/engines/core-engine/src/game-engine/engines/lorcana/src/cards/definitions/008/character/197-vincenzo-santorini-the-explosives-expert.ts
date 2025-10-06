import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vincenzoSantoriniTheExplosivesExpert: LorcanaCharacterCardDefinition =
  {
    id: "m9k",
    name: "Vincenzo Santorini",
    title: "The Explosives Expert",
    characteristics: ["storyborn", "ally"],
    text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
    type: "character",
    abilities: [
      whenYouPlayThis({
        name: "I JUST LIKE TO BLOW THINGS UP",
        text: "When you play this character, you may deal 3 damage to chosen character.",
        optional: true,
        effects: [
          {
            type: "damage",
            amount: 3,
            target: chosenCharacter,
          },
        ],
      }),
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 7,
    strength: 2,
    willpower: 8,
    illustrator: "Ho Jung Song",
    number: 197,
    set: "008",
    rarity: "rare",
    lore: 3,
  };
