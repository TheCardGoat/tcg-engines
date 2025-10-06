import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sirPellinoreSeasonedKnight: LorcanaCharacterCardDefinition = {
  id: "dfp",
  name: "Sir Pellinore",
  title: "Seasoned Knight",
  characteristics: ["storyborn", "knight"],
  text: "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "CODE OF HONOR",
      text: "Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      effects: [
        {
          type: "ability",
          ability: "support",
          modifier: "add",
          duration: "turn",
          until: true,
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Rudy Hill",
  number: 154,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
