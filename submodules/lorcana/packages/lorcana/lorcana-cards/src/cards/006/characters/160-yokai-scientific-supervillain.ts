import type { CharacterCard } from "@tcg/lorcana-types";
import { yokaiScientificSupervillainI18n } from "./160-yokai-scientific-supervillain.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const yokaiScientificSupervillain: CharacterCard = {
  id: "dzp",
  canonicalId: "ci_dzp",
  reprints: ["set6-160"],
  cardType: "character",
  name: "Yokai",
  version: "Scientific Supervillain",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 160,
  rarity: "rare",
  cost: 9,
  strength: 6,
  willpower: 10,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2ee125c29104a138b2a26608d6849c1",
    tcgPlayer: 588333,
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "NEUROTRANSMITTER",
      description: "You may play items named Microbots for free.",
    },
    {
      title: "TECHNICAL GAIN",
      description:
        "Whenever this character quests, draw a card for each opposing character with {S}.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Inventor"],
  abilities: [
    shift(6),
    {
      effect: {
        type: "cost-reduction",
        cardType: "item",
        cardName: "Microbots",
        amount: 99,
      },
      id: "11l-2",
      name: "NEUROTRANSMITTER",
      text: "NEUROTRANSMITTER You may play items named Microbots for free.",
      type: "static",
    },
    {
      effect: {
        amount: {
          type: "filtered-count",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "strength-comparison",
              comparison: "equal",
              value: 0,
            },
          ],
        },
        target: "CONTROLLER",
        type: "draw",
      },
      id: "11l-3",
      name: "TECHNICAL GAIN",
      text: "TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with 0 {S}.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: yokaiScientificSupervillainI18n,
};
