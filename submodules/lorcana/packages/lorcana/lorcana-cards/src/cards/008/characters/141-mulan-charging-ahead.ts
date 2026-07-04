import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanChargingAheadI18n } from "./141-mulan-charging-ahead.i18n";

import { reckless } from "../../../helpers/abilities/reckless";

export const mulanChargingAhead: CharacterCard = {
  id: "GUa",
  canonicalId: "ci_KZj",
  slug: "lorcana-ci_KZj",
  printings: [
    {
      id: "set8-141",
      artId: "set8-141",
      setCode: "set8",
      collectorNumber: "141",
      rarity: "common",
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
  cardNumber: 141,
  rarity: "common",
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
  i18n: mulanChargingAheadI18n,
};
