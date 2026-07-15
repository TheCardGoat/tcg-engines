import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanChargingAheadC2ChallengeI18n } from "./c2-007-mulan-charging-ahead-challenge.i18n";

import { reckless } from "../../../helpers/abilities/reckless";

export const mulanChargingAheadC2Challenge: CharacterCard = {
  id: "LqE",
  canonicalId: "ci_KZj",
  slug: "lorcana-ci_KZj",
  printings: [
    {
      id: "set8-c2-007-challenge",
      artId: "ci_KZj-challenge",
      setCode: "set8",
      collectorNumber: "7",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set8-141"],
  cardType: "character",
  name: "Mulan",
  version: "Charging Ahead",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 7,
  rarity: "special",
  specialRarity: "challenge",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_47c0a77fd61a4c98a3d2e4608bcbc844",
    tcgPlayer: "672467",
  },
  text: [
    {
      title: "Reckless",
    },
    {
      title: "BURST OF SPEED",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
    {
      title: "LONG RANGE",
      description: "This character can challenge ready characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    reckless,
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "17c-2",
      name: "BURST OF SPEED",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "static",
    },
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "17c-3",
      name: "LONG RANGE",
      text: "LONG RANGE This character can challenge ready characters.",
      type: "static",
    },
  ],
  i18n: mulanChargingAheadC2ChallengeI18n,
};
