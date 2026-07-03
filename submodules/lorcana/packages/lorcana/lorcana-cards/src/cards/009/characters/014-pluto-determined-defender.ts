import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoDeterminedDefenderI18n } from "./014-pluto-determined-defender.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const plutoDeterminedDefender: CharacterCard = {
  id: "fop",
  canonicalId: "ci_Iga",
  slug: "lorcana-ci_Iga",
  printings: [
    {
      id: "set9-014",
      artId: "set9-014",
      setCode: "set9",
      collectorNumber: "14",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set3-017", "set9-014"],
  cardType: "character",
  name: "Pluto",
  version: "Determined Defender",
  inkType: ["amber"],
  set: "009",
  cardNumber: 14,
  rarity: "rare",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d30e5a514aae4bd9b28d98cf45569a23",
    tcgPlayer: "649963",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Bodyguard",
    },
    {
      title: "GUARD DOG",
      description: "At the start of your turn, remove up to 3 damage from this character.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "zh2-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    bodyguard,
    {
      effect: {
        amount: { type: "up-to", value: 3 },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "self",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "zh2-3",
      name: "GUARD DOG",
      text: "GUARD DOG At the start of your turn, remove up to 3 damage from this character.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: plutoDeterminedDefenderI18n,
};
