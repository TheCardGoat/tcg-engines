import type { CharacterCard } from "@tcg/lorcana-types";
import { willOTheWispForestSpiritP3ChallengeI18n } from "./p3-051-will-o-the-wisp-forest-spirit-challenge.i18n";

export const willOTheWispForestSpiritP3Challenge: CharacterCard = {
  id: "huu",
  canonicalId: "ci_SZs",
  slug: "lorcana-ci_SZs",
  printings: [
    {
      id: "set12-p3-051-challenge",
      artId: "ci_SZs-challenge",
      setCode: "set12",
      collectorNumber: "51",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set12-047"],
  cardType: "character",
  name: "Will o' the Wisp",
  version: "Forest Spirit",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 51,
  rarity: "special",
  specialRarity: "challenge",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4d61ccc401a942719bfcafde3a132578",
    tcgPlayer: "690524",
  },
  text: [
    {
      title: "COME ON OUT",
      description:
        "When this character is banished in a challenge, you may return this card to your hand.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "Wy1-1",
      name: "COME ON OUT",
      type: "triggered",
      text: "COME ON OUT When this character is banished in a challenge, you may return this card to your hand.",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            ref: "self",
          },
        },
      },
    },
  ],
  i18n: willOTheWispForestSpiritP3ChallengeI18n,
};
