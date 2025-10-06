// TODO: Once the set is released, we organize the cards by set and type

import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chiefBogoGazelleFan: LorcanaCharacterCardDefinition = {
  id: "xym",
  missingTestCase: true,
  name: "Chief Bogo",
  title: "Gazelle Fan",
  characteristics: ["storyborn"],
  text: "YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "You Like Gazelle Too",
      text: "While you have a character named Gazelle in play, this character gains Singer 6.",
      ability: singerAbility(6),
      characterName: "Gazelle",
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 11,
  set: "006",
  rarity: "common",
};
