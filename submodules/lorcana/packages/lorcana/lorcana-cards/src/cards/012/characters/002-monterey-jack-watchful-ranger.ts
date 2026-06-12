import type { CharacterCard } from "@tcg/lorcana-types";
import { montereyJackWatchfulRangerI18n } from "./002-monterey-jack-watchful-ranger.i18n";

export const montereyJackWatchfulRanger: CharacterCard = {
  id: "KWV",
  canonicalId: "ci_KWV",
  reprints: ["set12-002"],
  cardType: "character",
  name: "Monterey Jack",
  version: "Watchful Ranger",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 2,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a277ec572a7c4e2b8a351bfd233c139c",
  },
  text: [
    {
      title: "BIRD'S-EYE VIEW",
      description:
        "When you play this character, you may reveal the top card of your deck. If it's a character card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "KWV-1",
      name: "BIRD'S-EYE VIEW",
      type: "triggered",
      text: "BIRD'S-EYE VIEW When you play this character, you may reveal the top card of your deck. If it's a character card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          target: "CONTROLLER",
          revealAll: true,
          destinations: [
            {
              zone: "hand",
              min: 0,
              max: 1,
              filter: {
                type: "card-type",
                cardType: "character",
              },
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
      },
    },
  ],
  i18n: montereyJackWatchfulRangerI18n,
};
