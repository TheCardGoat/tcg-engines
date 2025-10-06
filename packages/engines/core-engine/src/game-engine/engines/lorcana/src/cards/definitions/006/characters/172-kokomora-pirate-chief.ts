// TODO: Once the set is released, we organize the cards by set and type

import {
  dealDamageEffect,
  drawACard,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  chosenCardFromYourHand,
  chosenCharacterOrLocation,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kokomoraPirateChief: LorcanaCharacterCardDefinition = {
  id: "lcy",
  name: "Kakamora",
  title: "Pirate Chief",
  characteristics: ["storyborn", "pirate", "captain"],
  text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Coconut Leader",
      text: "Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
      optional: true,
      resolveEffectsIndividually: true,
      effects: [
        drawACard,
        {
          type: "discard",
          amount: 1,
          target: chosenCardFromYourHand,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              filters: [{ filter: "characteristics", value: ["pirate"] }],
              // TODO: get rid of target
              target: thisCharacter,
              effects: [dealDamageEffect(3, chosenCharacterOrLocation)],
              fallback: [dealDamageEffect(1, chosenCharacterOrLocation)],
            },
          ],
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  illustrator: "Juan Diego Leon",
  number: 172,
  set: "006",
  rarity: "rare",
};
