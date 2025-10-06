// TODO: Once the set is released, we organize the cards by set and type

import { returnThisCardToHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iagoReappearingParrot: LorcanaCharacterCardDefinition = {
  id: "s12",
  name: "Iago",
  title: "Reappearing Parrot",
  characteristics: ["dreamborn", "ally"],
  text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanishedInAChallenge({
      name: "Guess Who",
      text: "When this character is banished in a challenge, return this card to your hand.",
      effects: [returnThisCardToHand],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  illustrator: "Cam Kendell",
  number: 45,
  set: "006",
  rarity: "common",
};
