import type { CharacterCard } from "@tcg/lorcana-types";
import { drHamstervielInfamousScientistI18n } from "./186-dr-hamsterviel-infamous-scientist.i18n";

export const drHamstervielInfamousScientist: CharacterCard = {
  id: "U34",
  canonicalId: "ci_U34",
  reprints: ["set11-186"],
  cardType: "character",
  name: "Dr. Hamsterviel",
  version: "Infamous Scientist",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 186,
  rarity: "rare",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fa25fc0098884a649dc40a9e0551cff2",
    tcgPlayer: 673301,
  },
  text: [
    {
      title: "CONTROLLED VARIABLES",
      description:
        "For each Alien character card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "AWESTRUCK",
      description:
        "When you play this character, chosen opposing character can't challenge during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Inventor"],
  abilities: [
    {
      id: "U34-0",
      name: "CONTROLLED VARIABLES",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          cardType: "character",
          owner: "you",
          zones: ["discard"],
          filters: [
            {
              type: "has-classification",
              classification: "Alien",
            },
          ],
        },
      },
      text: "CONTROLLED VARIABLES For each Alien character card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      id: "U34-1",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        restriction: "cant-challenge",
        target: {
          selector: "chosen",
          cardTypes: ["character"],
          owner: "opponent",
          zones: ["play"],
          count: 1,
        },
        type: "restriction",
        duration: "their-next-turn",
      },
      name: "AWESTRUCK",
      type: "triggered",
      text: "AWESTRUCK When you play this character, chosen opposing character can't challenge during their next turn.",
    },
  ],
  i18n: drHamstervielInfamousScientistI18n,
};
