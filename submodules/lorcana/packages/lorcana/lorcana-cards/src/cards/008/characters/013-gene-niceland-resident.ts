import type { CharacterCard } from "@tcg/lorcana-types";
import { geneNicelandResidentI18n } from "./013-gene-niceland-resident.i18n";

export const geneNicelandResident: CharacterCard = {
  id: "DbU",
  canonicalId: "ci_DbU",
  reprints: ["set8-013"],
  cardType: "character",
  name: "Gene",
  version: "Niceland Resident",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 13,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c4cc9368ba4d4f488b35ac8f8b0b07a1",
    tcgPlayer: 631357,
  },
  text: [
    {
      title: "I GUESS YOU EARNED THIS",
      description:
        "Whenever this character quests, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "mcz-1",
      name: "I GUESS YOU EARNED THIS",
      text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: geneNicelandResidentI18n,
};
