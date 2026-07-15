import type { CharacterCard } from "@tcg/lorcana-types";
import { sulleyBooScareBuddiesI18n } from "./029-sulley-boo-scare-buddies.i18n";

import { comboShift } from "../../../helpers/abilities/shift";

export const sulleyBooScareBuddies: CharacterCard = {
  id: "1Iy",
  canonicalId: "ci_1Iy",
  slug: "lorcana-ci_1Iy",
  printings: [
    {
      id: "set13-029",
      artId: "set13-029",
      setCode: "set13",
      collectorNumber: "29",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-029"],
  cardType: "character",
  name: "Sulley & Boo",
  version: "Scare Buddies",
  inkType: ["amber", "ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 29,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_84ac4e601f31462988d5fef80d41f5b2",
  },
  text: [
    {
      title: "Combo Shift 4 {I}",
    },
    {
      title: "THE POWER OF FRIENDSHIP",
      description:
        "When this character is banished, if any of the cards that were under them are character cards, you may play those characters from your discard for free.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Monster"],
  abilities: [
    comboShift(["Sulley", "Boo"], 4),
    {
      type: "triggered",
      name: "THE POWER OF FRIENDSHIP",
      text: "THE POWER OF FRIENDSHIP When this character is banished, if any of the cards that were under them are character cards, you may play those characters from your discard for free.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "trigger-subject-had-card-under",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "play-card",
              from: "discard",
              cardType: "character",
              cost: "free",
              filter: {
                cardType: "character",
                inEventSnapshotCardsUnder: true,
              },
            },
            {
              type: "play-card",
              from: "discard",
              cardType: "character",
              cost: "free",
              filter: {
                cardType: "character",
                inEventSnapshotCardsUnder: true,
              },
            },
          ],
        },
      },
    },
  ],
  i18n: sulleyBooScareBuddiesI18n,
};
