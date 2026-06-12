import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalSinglemindedI18n } from "./051-bruno-madrigal-single-minded.i18n";

export const brunoMadrigalSingleminded: CharacterCard = {
  id: "qZd",
  canonicalId: "ci_qZd",
  reprints: ["set8-051"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Single-Minded",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 51,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8aa3ca8ac51847e2987d4798c5ddb893",
    tcgPlayer: 631385,
  },
  text: [
    {
      title: "STANDING TALL",
      description:
        "When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      effect: {
        duration: "their-next-turn",
        restriction: "cant-ready",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "restriction",
      },
      id: "1a1-1",
      name: "STANDING TALL",
      text: "STANDING TALL When you play this character, chosen opposing character can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: brunoMadrigalSinglemindedI18n,
};
