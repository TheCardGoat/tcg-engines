import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { flynnRiderSpectralScoundrelI18n } from "./081-flynn-rider-spectral-scoundrel.i18n";

export const flynnRiderSpectralScoundrel: CharacterCard = {
  id: "Gbt",
  canonicalId: "ci_Gbt",
  reprints: ["set10-081"],
  cardType: "character",
  name: "Flynn Rider",
  version: "Spectral Scoundrel",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e24a3ebbac57485091abad86f0e5064f",
    tcgPlayer: 659452,
  },
  text: [
    {
      title: "Boost 2 {I}",
      description:
        "(Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)",
    },
    {
      title: "I'LL TAKE THAT",
      description:
        "As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "73r-2",
      name: "I'LL TAKE THAT",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
    },
    {
      id: "73r-3",
      name: "I'LL TAKE THAT",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
    },
  ],
  i18n: flynnRiderSpectralScoundrelI18n,
};
