import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteWellWisherEnchantedI18n } from "./206-snow-white-well-wisher-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const snowWhiteWellWisherEnchanted: CharacterCard = {
  id: "65h",
  canonicalId: "ci_IGd",
  slug: "lorcana-ci_IGd",
  printings: [
    {
      id: "set2-206-enchanted",
      artId: "ci_IGd-enchanted",
      setCode: "set2",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-025"],
  cardType: "character",
  name: "Snow White",
  version: "Well Wisher",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e97e4b9894fe4c9798b0d925092d3eea",
    tcgPlayer: "527799",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "WISHES COME TRUE",
      description:
        "Whenever this character quests, you may return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1fh-2",
      name: "WISHES COME TRUE",
      text: "WISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: snowWhiteWellWisherEnchantedI18n,
};
