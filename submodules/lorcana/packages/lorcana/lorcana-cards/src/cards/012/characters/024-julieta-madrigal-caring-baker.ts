import type { CharacterCard } from "@tcg/lorcana-types";
import { julietaMadrigalCaringBakerI18n } from "./024-julieta-madrigal-caring-baker.i18n";

export const julietaMadrigalCaringBaker: CharacterCard = {
  id: "ysZ",
  canonicalId: "ci_ysZ",
  reprints: ["set12-024"],
  cardType: "character",
  name: "Julieta Madrigal",
  version: "Caring Baker",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 24,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0dffc260d1554199bc1b2ccf50fc1831",
  },
  text: [
    {
      title: "RESTORING RECIPE",
      description:
        "When you play this character and whenever she quests, you may remove up to 1 damage from chosen character or location.",
    },
  ],
  abilities: [
    {
      id: "ysZ-1",
      name: "RESTORING RECIPE",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
        },
      },
    },
    {
      id: "ysZ-2",
      name: "RESTORING RECIPE",
      type: "triggered",
      trigger: { event: "quest", on: "SELF", timing: "whenever" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
        },
      },
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Madrigal"],
  i18n: julietaMadrigalCaringBakerI18n,
};
