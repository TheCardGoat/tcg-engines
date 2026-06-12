import type { CharacterCard } from "@tcg/lorcana-types";
import { roquefortLockExpertI18n } from "./172-roquefort-lock-expert.i18n";

export const roquefortLockExpert: CharacterCard = {
  id: "P7n",
  canonicalId: "ci_P7n",
  reprints: ["set8-172"],
  cardType: "character",
  name: "Roquefort",
  version: "Lock Expert",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "008",
  cardNumber: 172,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d2291465ec4640f585a653be4290e2ac",
    tcgPlayer: 631675,
  },
  text: [
    {
      title: "SAFEKEEPING",
      description:
        "Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "P7n-1",
      name: "SAFEKEEPING",
      type: "triggered",
      text: "SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          facedown: true,
          exerted: true,
        },
      },
    },
  ],
  i18n: roquefortLockExpertI18n,
};
