import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesInfernalSchemerI18n } from "./147-hades-infernal-schemer.i18n";

export const hadesInfernalSchemer: CharacterCard = {
  id: "iRC",
  canonicalId: "ci_nzC",
  reprints: ["set1-147", "set9-151"],
  cardType: "character",
  name: "Hades",
  version: "Infernal Schemer",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 147,
  rarity: "legendary",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_050ae6da90154532905911c8c2569802",
    tcgPlayer: 651117,
  },
  text: [
    {
      title: "IS THERE A DOWNSIDE TO THIS?",
      description:
        "When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          facedown: true,
          source: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          target: "OPPONENT",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "12a-1",
      name: "IS THERE A DOWNSIDE TO THIS?",
      text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: hadesInfernalSchemerI18n,
};
