import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiEtherealGuideI18n } from "./052-rafiki-ethereal-guide.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const rafikiEtherealGuide: CharacterCard = {
  id: "4UH",
  canonicalId: "ci_ts7",
  reprints: ["set6-052"],
  cardType: "character",
  name: "Rafiki",
  version: "Ethereal Guide",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 52,
  rarity: "rare",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_d5432572fd3d4dfc95b01b682c71943c",
    tcgPlayer: 592032,
  },
  text: [
    {
      title: "Shift 7",
    },
    {
      title: "ASTRAL ATTUNEMENT",
      description:
        "During your turn, whenever a card is put into your inkwell, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
  abilities: [
    shift(7),
    {
      id: "yg2-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "ASTRAL ATTUNEMENT",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
      text: "ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
    },
  ],
  i18n: rafikiEtherealGuideI18n,
};
