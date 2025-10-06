import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseWaywardSorcerer: LorcanitoCharacterCardDefinition = {
  id: "kuw",

  name: "Mickey Mouse",
  title: "Wayward Sorcerer",
  characteristics: ["dreamborn", "sorcerer"],
  text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
  type: "character",
  abilities: [
    {
      type: "static",
      name: "Animate Broom",
      text: "You pay 1 {I} less to play Broom characters.",
      ability: "effects",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "static",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["broom"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
    wheneverOneOfYourCharactersIsBanishedInAChallenge({
      name: "Ceaseless Worker",
      text: "Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
      optional: true,
      triggerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["broom"] },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
      ],
    }),
  ],
  flavour: "He always goes for the clean sweep.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 51,
  set: "TFC",
  rarity: "super_rare",
};
