import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaPrideProtectorC2ChallengeI18n } from "./c2-008-simba-pride-protector-challenge.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const simbaPrideProtectorC2Challenge: CharacterCard = {
  id: "UGW",
  canonicalId: "ci_pBr",
  slug: "lorcana-ci_pBr",
  printings: [
    {
      id: "set6-c2-008-challenge",
      artId: "ci_pBr-challenge",
      setCode: "set6",
      collectorNumber: "8",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-020"],
  cardType: "character",
  name: "Simba",
  version: "Pride Protector",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 8,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1cf3dd6de9ac4bc6b0a1ef39f7e6085f",
    tcgPlayer: "655963",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "UNDERSTAND THE BALANCE",
      description:
        "At the end of your turn, if this character is exerted, you may ready your other characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(3),
    {
      id: "1i7-2",
      name: "UNDERSTAND THE BALANCE",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "source",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          type: "ready",
        },
        type: "optional",
      },
      text: "UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
    },
  ],
  i18n: simbaPrideProtectorC2ChallengeI18n,
};
