import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { littleJohnImpermanentOutlawI18n } from "./092-little-john-impermanent-outlaw.i18n";

export const littleJohnImpermanentOutlaw: CharacterCard = {
  id: "eD4",
  canonicalId: "ci_eD4",
  reprints: ["set10-092"],
  cardType: "character",
  name: "Little John",
  version: "Impermanent Outlaw",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "010",
  cardNumber: 92,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_b3668f2df08949359912fa775c750a52",
    tcgPlayer: 659413,
  },
  text: [
    {
      title: "Boost 3 {I}",
    },
    {
      title: "READY TO RASSLE",
      description: "Whenever you put a card under this character, ready him.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    boost(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "ready",
        },
        type: "optional",
      },
      id: "196-2",
      name: "READY TO RASSLE",
      text: "READY TO RASSLE Whenever you put a card under this character, ready him.",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: littleJohnImpermanentOutlawI18n,
};
