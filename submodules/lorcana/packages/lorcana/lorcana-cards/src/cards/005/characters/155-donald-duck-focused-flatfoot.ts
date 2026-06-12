import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckFocusedFlatfootI18n } from "./155-donald-duck-focused-flatfoot.i18n";

export const donaldDuckFocusedFlatfoot: CharacterCard = {
  id: "X12",
  canonicalId: "ci_X12",
  reprints: ["set5-155"],
  cardType: "character",
  name: "Donald Duck",
  version: "Focused Flatfoot",
  inkType: ["sapphire"],
  set: "005",
  cardNumber: 155,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d82ace7e03d34ca587519f2c089dc515",
    tcgPlayer: 561650,
  },
  text: [
    {
      title: "BAFFLING MYSTERY",
      description:
        "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "htc-1",
      name: "BAFFLING MYSTERY",
      text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckFocusedFlatfootI18n,
};
