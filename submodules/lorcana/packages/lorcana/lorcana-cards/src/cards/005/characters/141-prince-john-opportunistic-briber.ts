import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnOpportunisticBriberI18n } from "./141-prince-john-opportunistic-briber.i18n";

export const princeJohnOpportunisticBriber: CharacterCard = {
  id: "wvs",
  canonicalId: "ci_wvs",
  reprints: ["set5-141"],
  cardType: "character",
  name: "Prince John",
  version: "Opportunistic Briber",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 141,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_16dd3d0f11fb4a96a4aa7d7f69468a23",
    tcgPlayer: 561648,
  },
  text: [
    {
      title: "TAXES NEVER FAIL ME",
      description: "Whenever you play an item, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "qie-1",
      name: "TAXES NEVER FAIL ME",
      text: "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: princeJohnOpportunisticBriberI18n,
};
