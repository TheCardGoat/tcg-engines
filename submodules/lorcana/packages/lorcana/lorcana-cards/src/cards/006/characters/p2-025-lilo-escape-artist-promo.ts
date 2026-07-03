import type { CharacterCard } from "@tcg/lorcana-types";
import { liloEscapeArtistP2PromoI18n } from "./p2-025-lilo-escape-artist-promo.i18n";

export const liloEscapeArtistP2Promo: CharacterCard = {
  id: "4Oc",
  canonicalId: "ci_QQH",
  slug: "lorcana-ci_QQH",
  printings: [
    {
      id: "set6-p2-025-promo",
      artId: "ci_QQH-promo",
      setCode: "set6",
      collectorNumber: "25",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-002"],
  cardType: "character",
  name: "Lilo",
  version: "Escape Artist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 25,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f17c60d077554d25b50fd934061b2e32",
    tcgPlayer: "592015",
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
  i18n: liloEscapeArtistP2PromoI18n,
};
