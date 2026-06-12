import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseBobCratchitI18n } from "./159-mickey-mouse-bob-cratchit.i18n";

export const mickeyMouseBobCratchit: CharacterCard = {
  id: "Dfc",
  canonicalId: "ci_mnC",
  reprints: ["set11-159"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Bob Cratchit",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 159,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7379a15083914913b21c37d59e503c0c",
    tcgPlayer: 677154,
  },
  text: [
    {
      title: "HARD WORK",
      description:
        "Whenever this character quests, put the top card of your deck facedown under him.",
    },
    {
      title: "A GIVING HEART",
      description:
        "When this character is banished in a challenge, you may put all cards that were under him under another chosen character or location of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "Dfc-1",
      name: "HARD WORK",
      text: "HARD WORK Whenever this character quests, put the top card of your deck facedown under him.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: "self",
      },
    },
    {
      id: "Dfc-2",
      name: "A GIVING HEART",
      text: "A GIVING HEART When this character is banished in a challenge, you may put all cards that were under him under another chosen character or location of yours.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      condition: {
        type: "trigger-subject-had-card-under",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-cards-from-under",
          source: "snapshot-cards-under",
          destination: "under-chosen",
          underTarget: {
            cardTypes: ["character", "location"],
            count: 1,
            owner: "you",
            selector: "chosen",
            zones: ["play"],
          },
        },
      },
    },
  ],
  i18n: mickeyMouseBobCratchitI18n,
};
