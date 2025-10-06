import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaIceSurfer: LorcanitoCharacterCardDefinition = {
  id: "a9h",
  name: "Elsa",
  title: "Ice Surfer",
  characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
  text: "**THAT'S NO BLIZZARD** Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "THAT'S NO BLIZZARD",
      text: "Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Anna" },
          },
        ],
      },
      effects: readyAndCantQuest({
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Elsa" },
          },
        ],
      }),
    }),
  ],
  flavour:
    "My sister has always been there for me. I need to be there for her.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 109,
  set: "TFC",
  rarity: "common",
};
