import type { CharacterCard } from "@tcg/lorcana-types";
import { priyaMangalSeriousMusicLoverI18n } from "./008-priya-mangal-serious-music-lover.i18n";

export const priyaMangalSeriousMusicLover: CharacterCard = {
  id: "eK4",
  canonicalId: "ci_eK4",
  slug: "lorcana-ci_eK4",
  printings: [
    {
      id: "set13-008",
      artId: "set13-008",
      setCode: "set13",
      collectorNumber: "8",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-008"],
  cardType: "character",
  name: "Priya Mangal",
  version: "Serious Music Lover",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 8,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c6e7805e169f4387b3b24b9f358b6400",
  },
  text: [
    {
      title: "THIS IS MY JAM",
      description:
        "When you play this character, if there's a song card in your discard, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      id: "eK4-1",
      name: "THIS IS MY JAM",
      text: "THIS IS MY JAM When you play this character, if there's a song card in your discard, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    },
  ],
  i18n: priyaMangalSeriousMusicLoverI18n,
};
