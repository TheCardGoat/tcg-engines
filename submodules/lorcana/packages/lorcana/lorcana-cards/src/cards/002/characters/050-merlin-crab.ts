import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinCrabI18n } from "./050-merlin-crab.i18n";

export const merlinCrab: CharacterCard = {
  id: "mYZ",
  canonicalId: "ci_mYZ",
  reprints: ["set2-050"],
  cardType: "character",
  name: "Merlin",
  version: "Crab",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 50,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce53812441ff4a67bd0b987da44126c8",
    tcgPlayer: 522652,
  },
  text: [
    {
      title: "READY OR NOT!",
      description:
        "When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 3,
      },
      id: "mYZ-1",
      name: "READY OR NOT!",
      text: "When you play this character and when he leaves play, chosen character gains Challenger +3 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 3,
      },
      id: "mYZ-2",
      name: "READY OR NOT!",
      text: "When you play this character and when he leaves play, chosen character gains Challenger +3 this turn.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinCrabI18n,
};
