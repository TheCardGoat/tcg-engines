// TODO: Once the set is released, we organize the cards by set and type

import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cobraBubblesFormerCia: LorcanaCharacterCardDefinition = {
  id: "agb",
  missingTestCase: true,
  name: "Cobra Bubbles",
  title: "Former CIA",
  characteristics: ["dreamborn", "ally"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      ...youMayDrawThenChooseAndDiscard,
      type: "activated",
      costs: [{ type: "ink", amount: 2 }],
      name: "Think About What's Best",
      text: "Draw a card, then choose and discard a card.",
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Eri Welli",
  number: 188,
  set: "006",
  rarity: "rare",
};
