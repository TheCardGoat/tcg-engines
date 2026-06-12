import type { CharacterCard } from "@tcg/lorcana-types";
import { shenziHyenaPackLeaderI18n } from "./085-shenzi-hyena-pack-leader.i18n";

export const shenziHyenaPackLeader: CharacterCard = {
  id: "BdK",
  canonicalId: "ci_VGS",
  reprints: ["set3-085", "set9-087"],
  cardType: "character",
  name: "Shenzi",
  version: "Hyena Pack Leader",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 85,
  rarity: "common",
  cost: 4,
  strength: 0,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b082a2cb0d9f4c24a54a8ebb85f6b0a6",
    tcgPlayer: 650027,
  },
  text: [
    {
      title: "I'LL HANDLE THIS",
      description: "While this character is at a location, she gets +3 {S}.",
    },
    {
      title: "WHAT'S THE HURRY?",
      description:
        "While this character is at a location, whenever she challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    {
      id: "qk2-1",
      name: "I'LL HANDLE THIS",
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.",
      type: "static",
    },
    {
      id: "qk2-2",
      name: "WHAT'S THE HURRY?",
      type: "triggered",
      trigger: {
        defender: {},
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "at-location",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "WHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
    },
  ],
  i18n: shenziHyenaPackLeaderI18n,
};
