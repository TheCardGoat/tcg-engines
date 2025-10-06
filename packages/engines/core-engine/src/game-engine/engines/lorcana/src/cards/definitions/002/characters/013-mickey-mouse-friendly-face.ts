import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseFriendlyFace: LorcanitoCharacterCardDefinition = {
  id: "ll5",
  name: "Mickey Mouse",
  title: "Friendly Face",
  characteristics: ["hero", "storyborn"],
  text: "**GLAD YOU'RE HERE!** Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Glad You're Here!",
      text: "Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
      effects: [
        {
          type: "replacement",
          replacement: "cost",
          duration: "next",
          amount: 3,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "type", value: "character" }],
          },
        },
      ],
    }),
  ],
  flavour: "Come on in−there's lots to explore.",
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 1,
  willpower: 6,
  lore: 3,
  illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
  number: 13,
  set: "ROF",
  rarity: "super_rare",
};
