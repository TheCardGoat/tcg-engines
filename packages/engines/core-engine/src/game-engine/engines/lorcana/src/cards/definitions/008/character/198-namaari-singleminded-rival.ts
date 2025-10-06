import { forEachCardInYourDiscard } from "~/game-engine/engines/lorcana/src/abilities/amounts";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import {
  thisCharacterGetsStrength,
  youMayDrawThenChooseAndDiscard,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const namaariSinglemindedRival: LorcanaCharacterCardDefinition = {
  id: "l8m",
  name: "Namaari",
  title: "Single-Minded Rival",
  characteristics: ["storyborn", "villain", "princess"],
  text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "EXTREME FOCUS",
      text: "This character gets +1 {S} for each card in your discard.",
      effects: [thisCharacterGetsStrength(forEachCardInYourDiscard)],
    },
    whenYouPlayThis({
      ...youMayDrawThenChooseAndDiscard,
      name: "STRATEGIC EDGE",
      text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
    }),
    atTheStartOfYourTurn({
      ...youMayDrawThenChooseAndDiscard,
      name: "STRATEGIC EDGE",
      text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 0,
  willpower: 5,
  illustrator: "Max Ulrichney",
  number: 198,
  set: "008",
  rarity: "legendary",
  lore: 2,
};
