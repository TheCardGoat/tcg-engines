import type { CharacterCard } from "@tcg/lorcana-types";
import { vixeyForestFriendI18n } from "./086-vixey-forest-friend.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const vixeyForestFriend: CharacterCard = {
  id: "tPQ",
  canonicalId: "ci_tPQ",
  reprints: ["set11-086"],
  cardType: "character",
  name: "Vixey",
  version: "Forest Friend",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 86,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6edf9f351f6d4d8ea588fbbdbf8ed253",
    tcgPlayer: 676204,
  },
  text: [
    {
      title: "SHOWIN' UP",
      description:
        "If you have a character named Tod in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "q34-1",
      name: "SHOWIN' UP",
      condition: {
        controller: "you",
        name: "Tod",
        type: "has-named-character",
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      sourceZones: ["hand"],
      type: "static",
      text: "SHOWIN' UP If you have a character named Tod in play, you pay 1 {I} less to play this character.",
    },
    evasive,
  ],
  i18n: vixeyForestFriendI18n,
};
