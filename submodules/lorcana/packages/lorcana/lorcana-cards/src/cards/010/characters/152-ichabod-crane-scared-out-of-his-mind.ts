import type { CharacterCard } from "@tcg/lorcana-types";
import { ichabodCraneScaredOutOfHisMindI18n } from "./152-ichabod-crane-scared-out-of-his-mind.i18n";

export const ichabodCraneScaredOutOfHisMind: CharacterCard = {
  id: "qEC",
  canonicalId: "ci_qEC",
  reprints: ["set10-152"],
  cardType: "character",
  name: "Ichabod Crane",
  version: "Scared Out of His Mind",
  inkType: ["sapphire"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 152,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_295ea334c82b494ca1954f544117bf8a",
    tcgPlayer: 660021,
  },
  text: [
    {
      title: "CHILLING TALE",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "this-card",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1dh-1",
      name: "CHILLING TALE",
      text: "CHILLING TALE When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ichabodCraneScaredOutOfHisMindI18n,
};
