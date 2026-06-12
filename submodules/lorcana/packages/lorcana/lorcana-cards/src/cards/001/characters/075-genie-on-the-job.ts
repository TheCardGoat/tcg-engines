import type { CharacterCard } from "@tcg/lorcana-types";
import { genieOnTheJobI18n } from "./075-genie-on-the-job.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const genieOnTheJob: CharacterCard = {
  id: "Y8v",
  canonicalId: "ci_1oW",
  reprints: ["set1-075"],
  cardType: "character",
  name: "Genie",
  version: "On the Job",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 75,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ae7e91462bfc4861bbf97e99ed53a1c1",
    tcgPlayer: 510155,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "DISAPPEAR",
      description:
        "When you play this character, you may return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "n53-2",
      name: "DISAPPEAR",
      text: "DISAPPEAR When you play this character, you may return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: genieOnTheJobI18n,
};
