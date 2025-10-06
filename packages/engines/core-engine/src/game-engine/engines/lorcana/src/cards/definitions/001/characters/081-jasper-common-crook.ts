import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasperCommonCrook: LorcanaCharacterCardDefinition = {
  id: "agw",
  name: "Jasper",
  title: "Common Crook",
  characteristics: ["storyborn", "ally"],
  text: "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Puppynapping",
      text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "quest",
          duration: "next_turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "Now, look here, Horace, I warned you about thinkin.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Jochem Van Gool",
  number: 81,
  set: "TFC",
  rarity: "uncommon",
};
