// TODO: Once the set is released, we organize the cards by set and type

import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grandCouncilwomanFederationLeader: LorcanaCharacterCardDefinition =
  {
    id: "gs9",
    missingTestCase: true,
    name: "Grand Councilwoman",
    title: "Federation Leader",
    characteristics: ["storyborn", "alien"],
    text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
    type: "character",
    abilities: [
      wheneverQuests({
        name: "Find It!",
        text: "Whenever this character quests, your other Alien characters get +1 {L} this turn.",
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "add",
            duration: "turn",
            target: {
              type: "card",
              value: "all",
              excludeSelf: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "characteristics", value: ["alien"] },
              ],
            },
          },
        ],
      }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    strength: 1,
    willpower: 3,
    lore: 1,
    illustrator: "Aisha Durrgambetova",
    number: 17,
    set: "006",
    rarity: "common",
  };
