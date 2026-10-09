import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraDelightfulMusicianI18n } from "./019-aurora-delightful-musician.i18n";

export const auroraDelightfulMusician: CharacterCard = {
  id: "EoX",
  canonicalId: "ci_EoX",
  slug: "lorcana-ci_EoX",
  printings: [
    {
      id: "set14-019",
      artId: "set14-019",
      setCode: "set14",
      collectorNumber: "19",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-019"],
  cardType: "character",
  name: "Aurora",
  version: "Delightful Musician",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "014",
  cardNumber: 19,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cf9e33084f684d58a059e96bd7c83c09",
  },
  text: [
    {
      title: "MELODIC REFRAIN",
      description:
        "When you play this character, return a song card you played this turn with cost 3 or less from your discard to your hand.",
    },
    {
      title: "JOYOUS RECEPTION",
      description: "At the end of your turn, if you played a song this turn, gain 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "EoX-1",
      name: "MELODIC REFRAIN",
      type: "triggered",
      text: "MELODIC REFRAIN When you play this character, return a song card you played this turn with cost 3 or less from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["action"],
          filters: [
            { type: "is-song" },
            { type: "cost-comparison", comparison: "less-or-equal", value: 3 },
            { type: "played-this-turn" },
          ],
        },
      },
    },
    {
      id: "EoX-2",
      name: "JOYOUS RECEPTION",
      type: "triggered",
      text: "JOYOUS RECEPTION At the end of your turn, if you played a song this turn, gain 1 lore.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "played-songs",
        playerScope: "you",
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
  i18n: auroraDelightfulMusicianI18n,
};
