import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stichtCarefreeSurfer: LorcanaCharacterCardDefinition = {
  id: "jzu",
  reprints: ["jdo"],
  name: "Stitch",
  title: "Carefree Surfer",
  characteristics: ["hero", "dreamborn", "alien"],
  text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Ohana",
      text: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      resolutionConditions: [
        { type: "play", comparison: { operator: "gte", value: 3 } },
      ],
      effects: [
        {
          type: "draw",
          amount: 2,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour:
    "So you're from outer space, huh? I hear the surfing's choice.\n−David",
  inkwell: true,
  colors: ["amber"],
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  illustrator: "Marcel Berg",
  number: 21,
  set: "TFC",
  rarity: "legendary",
};
