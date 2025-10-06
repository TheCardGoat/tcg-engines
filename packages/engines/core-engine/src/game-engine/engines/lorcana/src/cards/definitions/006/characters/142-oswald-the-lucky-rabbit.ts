// TODO: Once the set is released, we organize the cards by set and type

import { revealTopOfDeckPutInPlayOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const oswaldTheLuckyRabbit: LorcanaCharacterCardDefinition = {
  id: "rrw",
  name: "Oswald",
  title: "The Lucky Rabbit",
  characteristics: ["storyborn", "hero"],
  text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and they enter play exerted. Otherwise put it on the bottom of your deck.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Favorable Chance",
      text: "During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and they enter play exerted. Otherwise put it on the bottom of your deck.",
      conditions: [{ type: "during-turn", value: "self" }],
      optional: true,
      resolveEffectsIndividually: true,
      effects: revealTopOfDeckPutInPlayOrDeck({
        mode: "bottom",
        tutorFilters: [
          { filter: "zone", value: "deck" },
          { filter: "owner", value: "self" },
          { filter: "type", value: "item" },
        ],
        playFilters: [{ filter: "type", value: "item" }],
      }),
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  illustrator: "Tom Bancroft / Kristen Breshears",
  number: 142,
  set: "006",
  rarity: "legendary",
};
