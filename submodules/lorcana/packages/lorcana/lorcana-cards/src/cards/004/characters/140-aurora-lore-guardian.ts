import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraLoreGuardianI18n } from "./140-aurora-lore-guardian.i18n";

export const auroraLoreGuardian: CharacterCard = {
  id: "k2u",
  canonicalId: "ci_k2u",
  reprints: ["set4-140"],
  cardType: "character",
  name: "Aurora",
  version: "Lore Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 140,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f6e236483db94d5cbd74ec3d0c69f685",
    tcgPlayer: 550605,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "PRESERVER",
      description: "Opponents can't choose your items for abilities or effects.",
    },
    {
      title: "ROYAL INVENTORY",
      description:
        "{E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "k2u-1",
      keyword: "Shift",
      text: "Shift 2 {I}",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
        type: "gain-keyword",
      },
      id: "k2u-2",
      name: "PRESERVER",
      text: "PRESERVER Opponents can't choose your items for abilities or effects.",
      type: "static",
    },
    {
      cost: {
        exertItems: 1,
      },
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "k2u-3",
      name: "ROYAL INVENTORY",
      text: "ROYAL INVENTORY {E} one of your items — Look at the top card of your deck and put it on either the top or the bottom of your deck.",
      type: "activated",
    },
  ],
  i18n: auroraLoreGuardianI18n,
};
