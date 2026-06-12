import type { ItemCard } from "@tcg/lorcana-types";
import { grimorumArcanorumI18n } from "./067-grimorum-arcanorum.i18n";

export const grimorumArcanorum: ItemCard = {
  id: "uwN",
  canonicalId: "ci_uwN",
  reprints: ["set10-067"],
  cardType: "item",
  name: "Grimorum Arcanorum",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 67,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_026c97ceb5a740ad879cc16ffc0d6116",
    tcgPlayer: 660360,
  },
  text: [
    {
      title: "DOCTRINA ADDUCERE",
      description: "During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
    },
    {
      title: "CELERITAS",
      description:
        "Your characters named Demona gain Rush. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "177-1",
      name: "DOCTRINA ADDUCERE",
      text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
      trigger: {
        event: "exert",
        on: {
          cardType: "character",
          controller: "opponent",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Rush",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Demona",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "177-2",
      name: "CELERITAS",
      text: "CELERITAS Your characters named Demona gain Rush.",
      type: "static",
    },
  ],
  i18n: grimorumArcanorumI18n,
};
