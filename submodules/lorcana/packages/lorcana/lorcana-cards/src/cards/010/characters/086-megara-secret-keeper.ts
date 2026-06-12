import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { megaraSecretKeeperI18n } from "./086-megara-secret-keeper.i18n";

export const megaraSecretKeeper: CharacterCard = {
  id: "YZf",
  canonicalId: "ci_uSJ",
  reprints: ["set10-086"],
  cardType: "character",
  name: "Megara",
  version: "Secret Keeper",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 86,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_78c11305e1674d348fe8839940f029a5",
    tcgPlayer: 658217,
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
  i18n: megaraSecretKeeperI18n,
};
