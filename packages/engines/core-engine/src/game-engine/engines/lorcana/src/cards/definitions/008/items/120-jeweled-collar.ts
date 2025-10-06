import { putTopCardOfYourDeckIntoYourInkwellExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";

import { yourCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import { targetCardsGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jeweledCollar: LorcanaItemCardDefinition = {
  id: "xhq",
  name: "Jeweled Collar",
  characteristics: ["item"],
  text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  inkwell: true,
  colors: ["emerald", "sapphire"],
  cost: 2,
  illustrator: "Filipe Laurentino",
  number: 120,
  set: "008",
  rarity: "uncommon",
  abilities: [
    targetCardsGains({
      name: "WELCOME EXTRAVAGANCE",
      text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
      target: yourCharacters,
      ability: whenChallenged({
        name: "WELCOME EXTRAVAGANCE",
        text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
        optional: true,
        effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
      }),
    }),
  ],
};
