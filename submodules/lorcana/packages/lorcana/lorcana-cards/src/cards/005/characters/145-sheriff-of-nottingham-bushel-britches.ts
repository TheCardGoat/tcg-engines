import type { CharacterCard } from "@tcg/lorcana-types";
import { sheriffOfNottinghamBushelBritchesI18n } from "./145-sheriff-of-nottingham-bushel-britches.i18n";
import { support } from "../../../helpers/abilities/support";

export const sheriffOfNottinghamBushelBritches: CharacterCard = {
  id: "ROz",
  canonicalId: "ci_ROz",
  reprints: ["set5-145"],
  cardType: "character",
  name: "Sheriff of Nottingham",
  version: "Bushel Britches",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 145,
  rarity: "rare",
  cost: 9,
  strength: 5,
  willpower: 9,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_f13c7ff8caa0471c9cea95ac9d2177c2",
    tcgPlayer: 561968,
  },
  text: [
    {
      title: "EVERY LITTLE BIT HELPS",
      description: "For each item you have in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: {
          controller: "you",
          type: "items-in-play",
        },
        type: "cost-reduction",
      },
      id: "ROz-1",
      text: "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.",
      name: "EVERY LITTLE BIT HELPS",
      sourceZones: ["hand"],
      type: "static",
    },
    support,
  ],
  i18n: sheriffOfNottinghamBushelBritchesI18n,
};
