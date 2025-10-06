import { duringOpponentsTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { wheneverOneOfYouCharactersIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chiefBogoCommandingOfficer: LorcanaCharacterCardDefinition = {
  id: "g07",
  name: "Chief Bogo",
  title: "Commanding Officer",
  characteristics: ["storyborn"],
  text: "SENDING BACKUP During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 5,
  willpower: 5,
  illustrator: "Nicola Savioli",
  number: 18,
  set: "008",
  rarity: "legendary",
  lore: 1,
  abilities: [
    wheneverOneOfYouCharactersIsBanished({
      name: "SENDING BACKUP",
      text: "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.",
      optional: true,
      conditions: [duringOpponentsTurn],
      triggerTarget: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "ability", value: "bodyguard" },
      ],
      effects: [
        {
          type: "reveal-and-play",
          putInto: "deck",
          exerted: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    }),
  ],
};
