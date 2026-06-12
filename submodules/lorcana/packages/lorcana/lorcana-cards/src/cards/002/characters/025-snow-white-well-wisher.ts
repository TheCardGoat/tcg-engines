import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteWellWisherI18n } from "./025-snow-white-well-wisher.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const snowWhiteWellWisher: CharacterCard = {
  id: "iql",
  canonicalId: "ci_IGd",
  reprints: ["set2-025"],
  cardType: "character",
  name: "Snow White",
  version: "Well Wisher",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 25,
  rarity: "legendary",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e97e4b9894fe4c9798b0d925092d3eea",
    tcgPlayer: 527799,
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
  i18n: snowWhiteWellWisherI18n,
};
