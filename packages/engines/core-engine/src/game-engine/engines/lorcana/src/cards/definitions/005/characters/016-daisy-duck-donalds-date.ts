import { revealTopOfDeckPutInHandOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckDonaldsDate: LorcanitoCharacterCardDefinition = {
  id: "x3z",
  name: "Daisy Duck",
  title: "Donald's Date",
  characteristics: ["storyborn", "ally"],
  text: "**BIG PRIZE** Whenever this character quests, each opponent reveals the top card of their deck. If it’s a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Big Prize",
      text: "Whenever this character quests, each opponent reveals the top card of their deck. If it’s a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
      responder: "opponent",
      effects: revealTopOfDeckPutInHandOrDeck({
        mode: "bottom",
        tutorFilters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      }),
    }),
  ],
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Francesco D'Ippolito / Giuseppi di Maio",
  number: 16,
  set: "SSK",
  rarity: "super_rare",
};
