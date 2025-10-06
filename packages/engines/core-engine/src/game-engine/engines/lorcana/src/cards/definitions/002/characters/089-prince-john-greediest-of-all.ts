import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverYourOpponentDiscardsOneOrMore } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeJohnGreediestOfAll: LorcanaCharacterCardDefinition = {
  id: "j3m",

  name: "Prince John",
  title: "Greediest of All",
  characteristics: ["dreamborn", "villain", "prince"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**I SENTENCE YOU** Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
  type: "character",
  abilities: [
    wheneverYourOpponentDiscardsOneOrMore({
      name: "I Sentence You",
      text: "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
      optional: true,
      effects: [drawACard],
    }),
    wardAbility,
  ],
  flavour: "Taxes! Taxes! Beautiful, lovely taxes!",
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Koni",
  number: 89,
  set: "ROF",
  rarity: "rare",
};
