import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalOutOfTheShadowsI18n } from "./038-bruno-madrigal-out-of-the-shadows.i18n";

export const brunoMadrigalOutOfTheShadows: CharacterCard = {
  id: "Ran",
  canonicalId: "ci_Ran",
  reprints: ["set4-038"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Out of the Shadows",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 38,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_140b4894a53d4884a4ec1e15dab9319a",
    tcgPlayer: 543899,
  },
  text: [
    {
      title: "IT WAS YOUR VISION",
      description:
        'When you play this character, chosen character gains "When this character is banished in a challenge, you may return this card to your hand" this turn.',
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      effect: {
        ability: "return-to-hand-when-banished",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "grant-ability",
      },
      id: "1qi-1",
      name: "IT WAS YOUR VISION",
      text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: brunoMadrigalOutOfTheShadowsI18n,
};
