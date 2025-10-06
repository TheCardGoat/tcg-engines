import { chosenItem } from "@lorcanito/lorcana-engine/abilities/target";
import type { BanishEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const judyHoppsOptimisticOfficer: LorcanitoCharacterCardDefinition = {
  id: "xdx",
  reprints: ["bcu"],
  name: "Judy Hopps",
  title: "Optimistic Officer",
  characteristics: ["hero", "storyborn"],
  text: "**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Don't Call me Cute",
      text: "When you play this character, you may banish chosen item. Its player draws a card.",
      optional: true,
      dependentEffects: true,
      effects: [
        {
          type: "banish",
          target: chosenItem,
        } as BanishEffect,
        {
          type: "draw",
          amount: 1,
          target: { type: "player", value: "target_owner" },
        },
      ],
    },
  ],
  flavour:
    "I'll get to the bottom of what happened with that locked lorebook. You can count on me!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Arianna Rea",
  number: 152,
  set: "ROF",
  rarity: "uncommon",
};
