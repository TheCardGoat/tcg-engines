// TODO: Once the set is released, we organize the cards by set and type

import { ifThisCharacterIsExerted } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookUnderhanded: LorcanaCharacterCardDefinition = {
  id: "fim",
  missingTestCase: true,
  name: "Captain Hook",
  title: "Underhanded",
  characteristics: ["storyborn", "villain", "pirate", "captain"],
  text: "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.\nUPPER HAND Whenever this character is challenged, draw a card.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "Upper Hand",
      text: "Whenever this character is challenged, draw a card.",
      effects: [drawACard],
    }),
    {
      type: "static",
      ability: "gain-ability",
      name: "Inspires Dread",
      text: "While this character is exerted, opposing Pirate characters can't quest.",
      conditions: [ifThisCharacterIsExerted],
      gainedAbility: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "restriction",
            restriction: "quest",
            duration: "static",
            target: thisCharacter,
          },
        ],
      },
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "opponent" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "characteristics", value: ["pirate"] },
        ],
      },
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Tony Bancroft / Lindsay Weyman",
  number: 71,
  set: "006",
  rarity: "rare",
};
