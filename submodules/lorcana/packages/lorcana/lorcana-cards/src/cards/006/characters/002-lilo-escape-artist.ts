import type { CharacterCard } from "@tcg/lorcana-types";
import { liloEscapeArtistI18n } from "./002-lilo-escape-artist.i18n";

export const liloEscapeArtist: CharacterCard = {
  id: "ZCd",
  canonicalId: "ci_ZCd",
  reprints: ["set6-002"],
  cardType: "character",
  name: "Lilo",
  version: "Escape Artist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 2,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f17c60d077554d25b50fd934061b2e32",
    tcgPlayer: 592015,
  },
  text: [
    {
      title: "NO PLACE I'D RATHER BE",
      description:
        "At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          entersExerted: true,
          filter: {
            cardType: "character",
            sameInstanceAsSource: true,
          },
          from: "discard",
          type: "play-card",
        },
        type: "optional",
      },
      sourceZones: ["discard"],
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      id: "ZCd-1",
      name: "NO PLACE I'D RATHER BE",
      text: "NO PLACE I'D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
      type: "triggered",
    },
  ],
  i18n: liloEscapeArtistI18n,
};
