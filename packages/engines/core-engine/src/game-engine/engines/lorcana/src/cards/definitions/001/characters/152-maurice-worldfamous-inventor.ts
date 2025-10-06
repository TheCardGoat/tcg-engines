import {
  wheneverPlays,
  wheneverQuests,
} from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauriceWorldFamousInventor: LorcanitoCharacterCardDefinition = {
  id: "v0e",

  name: "Maurice",
  title: "World-Famous Inventor",
  characteristics: ["dreamborn", "inventor", "mentor"],
  text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Give it a try",
      text: "Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "type", value: "item" }],
          },
        },
      ],
    }),
    wheneverPlays({
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "item" },
          { filter: "owner", value: "self" },
        ],
      },
      optional: true,
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  illustrator: "Alex Accorsi",
  number: 152,
  set: "TFC",
  rarity: "rare",
};
