import type { CharacterCard } from "@tcg/lorcana-types";
import { gadgetHackwrenchQuirkyScientistI18n } from "./099-gadget-hackwrench-quirky-scientist.i18n";

export const gadgetHackwrenchQuirkyScientist: CharacterCard = {
  id: "rbr",
  canonicalId: "ci_rbr",
  reprints: ["set8-099"],
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Quirky Scientist",
  inkType: ["emerald"],
  franchise: "Rescue Rangers",
  set: "008",
  cardNumber: 99,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d09689076d3344cd9a6fb53f2790c103",
    tcgPlayer: 631412,
  },
  text: [
    {
      title: "GOLLY!",
      description:
        "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-hand",
          controller: "opponent",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-hand",
          controller: "you",
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1xg-1",
      name: "GOLLY!",
      text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gadgetHackwrenchQuirkyScientistI18n,
};
