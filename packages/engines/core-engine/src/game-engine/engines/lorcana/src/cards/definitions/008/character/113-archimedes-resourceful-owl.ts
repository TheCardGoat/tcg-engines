import {
  banishChosenItem,
  youMayDrawThenChooseAndDiscard,
} from "@lorcanito/lorcana-engine/effects/effects";
import { duringYourTurnWheneverBanishesItem } from "~/game-engine/engines/lorcana/src/abilities";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const archimedesResourcefulOwl: LorcanaCharacterCardDefinition = {
  id: "qxe",
  name: "Archimedes",
  title: "Resourceful Owl",
  characteristics: ["storyborn", "ally"],
  text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.\nNOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "YOU DON'T NEED THAT",
      text: "When you play this character, you may banish chosen item.",
      optional: true,
      effects: [banishChosenItem],
    }),
    duringYourTurnWheneverBanishesItem({
      name: "NOW, THAT'S NOT BAD",
      text: "During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
      optional: true,
      resolveEffectsIndividually: true,
      ...youMayDrawThenChooseAndDiscard,
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Gwawi",
  number: 113,
  set: "008",
  rarity: "rare",
  lore: 2,
};
