import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putCardFromDiscardToInkwellFaceDownAndExerted } from "@lorcanito/lorcana-engine/effects/effects";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rollyChubbyPuppy: LorcanaCharacterCardDefinition = {
  id: "das",
  name: "Rolly",
  title: "Chubby Puppy",
  characteristics: ["storyborn", "puppy"],
  text: "Support \nADORABLE ANTICS When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    supportAbility,
    whenYouPlayThisCharacter({
      name: "ADORABLE ANTICS",
      text: "When you play this character, you may put a character card from your discard in your inkwell facedown and exerted.",
      optional: true,
      effects: [
        putCardFromDiscardToInkwellFaceDownAndExerted({
          filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "self" },
          ],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber", "sapphire"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "Oggy Christianson",
  number: 26,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
