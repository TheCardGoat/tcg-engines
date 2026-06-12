import type { CharacterCard } from "@tcg/lorcana-types";
import { bronxFerociousBeastI18n } from "./114-bronx-ferocious-beast.i18n";
import { reckless } from "../../../helpers/abilities/reckless";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const bronxFerociousBeast: CharacterCard = {
  id: "bvy",
  canonicalId: "ci_bvy",
  reprints: ["set10-114"],
  cardType: "character",
  name: "Bronx",
  version: "Ferocious Beast",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 114,
  rarity: "common",
  cost: 3,
  strength: 6,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_69fabb81a4894f389aea9207733a28c6",
    tcgPlayer: 658328,
  },
  text: [
    {
      title: "Reckless",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [reckless, stoneByDay],
  i18n: bronxFerociousBeastI18n,
};
