import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { getStrengthThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import {
  whenYouPlayThisCharacter,
  whenYouPlayThisForEachYouPayLess,
} from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trampEnterprisingDog: LorcanaCharacterCardDefinition = {
  id: "dxj",
  name: "Tramp",
  title: "Enterprising Dog",
  characteristics: ["storyborn", "hero"],
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Amanda MacFarlane",
  number: 110,
  set: "007",
  rarity: "rare",
  lore: 1,
  text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "Hey, Pidge",
      text: "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
      amount: 1,
      conditions: [ifYouHaveCharacterNamed("Lady")],
    }),
    whenYouPlayThisCharacter({
      name: "No Time for Wisecracks",
      text: "When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
      effects: [
        getStrengthThisTurn(
          {
            dynamic: true,
            excludeSelf: true,
            filters: [
              // TODO: I'm not sure why this is working, we should need to exclude himself from the sum as the text is `each other character`
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
          chosenCharacter,
        ),
      ],
    }),
  ],
};
