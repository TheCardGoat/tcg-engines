import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { ursulaWhisperOfVanessaI18n } from "./059-ursula-whisper-of-vanessa.i18n";

export const ursulaWhisperOfVanessa: CharacterCard = {
  id: "BB3",
  canonicalId: "ci_BB3",
  reprints: ["set10-059"],
  cardType: "character",
  name: "Ursula",
  version: "Whisper of Vanessa",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 59,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_340e919c6c0647b89636411cc834debc",
    tcgPlayer: 658327,
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "SLIPPERY SPELL",
      description: "While there's a card under this character, she gets +1 {L} and gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Whisper"],
  abilities: [
    boost(1),
    {
      id: "86p-2",
      name: "SLIPPERY SPELL",
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
      text: "SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.",
    },
    {
      id: "86p-3",
      name: "SLIPPERY SPELL",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      text: "SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.",
    },
  ],
  i18n: ursulaWhisperOfVanessaI18n,
};
