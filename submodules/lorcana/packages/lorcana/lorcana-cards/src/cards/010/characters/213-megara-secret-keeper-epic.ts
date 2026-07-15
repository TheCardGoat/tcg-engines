import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraSecretKeeperEpicI18n } from "./213-megara-secret-keeper-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const megaraSecretKeeperEpic: CharacterCard = {
  id: "wSO",
  canonicalId: "ci_uSJ",
  slug: "lorcana-ci_uSJ",
  printings: [
    {
      id: "set10-213-epic",
      artId: "ci_uSJ-epic",
      setCode: "set10",
      collectorNumber: "213",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-086"],
  cardType: "character",
  name: "Megara",
  version: "Secret Keeper",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_78c11305e1674d348fe8839940f029a5",
    tcgPlayer: "658217",
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "I'LL BE FINE",
      description:
        'While there\'s a card under this character, she gets +1 {L} and gains "Whenever this character is challenged, each opponent chooses and discards a card."',
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    boost(1),
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1af-2",
      name: "I'LL BE FINE",
      text: "I'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
      type: "static",
    },
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        ability: {
          effect: {
            amount: 1,
            chosen: true,
            target: "EACH_OPPONENT",
            type: "discard",
          },
          name: "I'LL BE FINE",
          text: "Whenever this character is challenged, each opponent chooses and discards a card.",
          trigger: {
            event: "challenged",
            on: "SELF",
            timing: "whenever",
          },
          type: "triggered",
        },
        target: "SELF",
        type: "grant-ability",
      },
      id: "1af-3",
      name: "I'LL BE FINE",
      text: "I'LL BE FINE While there's a card under this character, she gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
      type: "static",
    },
  ],
  i18n: megaraSecretKeeperEpicI18n,
};
