import type { CharacterCard } from "@tcg/lorcana-types";
import { goGoTomagoMechanicalEngineerI18n } from "./159-go-go-tomago-mechanical-engineer.i18n";

export const goGoTomagoMechanicalEngineer: CharacterCard = {
  id: "mVc",
  canonicalId: "ci_mVc",
  reprints: ["set8-159"],
  cardType: "character",
  name: "Go Go Tomago",
  version: "Mechanical Engineer",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 159,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bc3a96f6dcf64d1d87da6c83288a8146",
    tcgPlayer: 631691,
  },
  text: [
    {
      title: "NEED THIS!",
      description:
        "When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
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
      id: "hwg-1",
      name: "NEED THIS!",
      text: "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
          shiftedOntoSelf: true,
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: goGoTomagoMechanicalEngineerI18n,
};
