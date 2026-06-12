import type { LocationCard } from "@tcg/lorcana-types";
import { sevenDwarfsMineSecureFortressI18n } from "./204-seven-dwarfs-mine-secure-fortress.i18n";

export const sevenDwarfsMineSecureFortress: LocationCard = {
  id: "1uO",
  canonicalId: "ci_1uO",
  reprints: ["set5-204"],
  cardType: "location",
  name: "Seven Dwarfs' Mine",
  version: "Secure Fortress",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 204,
  rarity: "uncommon",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_30df26498319433588a4ee13b1397ea1",
    tcgPlayer: 561853,
  },
  text: [
    {
      title: "MOUNTAIN DEFENSE",
      description:
        "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          selfReplacement: {
            condition: {
              type: "trigger-subject-classification",
              classification: "Knight",
            },
            value: 2,
          },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "135-1",
      name: "MOUNTAIN DEFENSE",
      text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "first-time-each-turn",
          },
        ],
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: sevenDwarfsMineSecureFortressI18n,
};
