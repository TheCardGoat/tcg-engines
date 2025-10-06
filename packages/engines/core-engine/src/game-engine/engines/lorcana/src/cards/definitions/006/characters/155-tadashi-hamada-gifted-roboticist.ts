// TODO: Once the set is released, we organize the cards by set and type

import {
  putThisCardIntoYourInkwellExerted,
  putTopCardOfYourDeckIntoYourInkwellExerted,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tadashiHamadaGiftedRoboticist: LorcanaCharacterCardDefinition = {
  id: "aab",
  missingTestCase: true,
  name: "Tadashi Hamada",
  title: "Gifted Roboticist",
  characteristics: ["storyborn", "mentor", "inventor"],
  text: "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Someone Has To Help",
      text: "During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.",
      conditions: [{ type: "during-turn", value: "opponent" }],
      optional: true,
      effects: [
        putThisCardIntoYourInkwellExerted,
        putTopCardOfYourDeckIntoYourInkwellExerted,
      ],
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Aliseth Zermeno",
  number: 155,
  set: "006",
  rarity: "rare",
};
