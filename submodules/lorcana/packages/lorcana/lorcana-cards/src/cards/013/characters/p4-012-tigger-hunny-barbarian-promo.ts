import type { CharacterCard } from "@tcg/lorcana-types";
import { tiggerHunnyBarbarianP4PromoI18n } from "./p4-012-tigger-hunny-barbarian-promo.i18n";

import { reckless } from "../../../helpers/abilities/reckless";

export const tiggerHunnyBarbarianP4Promo: CharacterCard = {
  id: "ZlG",
  canonicalId: "ci_OKL",
  slug: "lorcana-ci_OKL",
  printings: [
    {
      id: "set13-p4-012-promo",
      artId: "ci_OKL-promo",
      setCode: "set13",
      collectorNumber: "12",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-126"],
  cardType: "character",
  name: "Tigger",
  version: "Hunny Barbarian",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 12,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_a64acded1f7842399029a5fa95b6c78d",
    tcgPlayer: "702660",
  },
  text: [
    {
      title: "Reckless",
    },
    {
      title: "PROTECTIVE CHARGE",
      description:
        "Once during your turn, whenever this character challenges another character, you may ready chosen Hunny character. If you do, that character can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Tigger", "Hunny"],
  abilities: [
    reckless,
    {
      id: "OKL-1",
      name: "PROTECTIVE CHARGE",
      type: "triggered",
      text: "PROTECTIVE CHARGE Once during your turn, whenever this character challenges another character, you may ready chosen Hunny character. If you do, that character can't quest for the rest of this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          { type: "once-per-turn" },
          { type: "during-turn", whose: "your" },
          { type: "defender-is-character" },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filters: [{ type: "has-classification", classification: "Hunny" }],
              },
            },
            {
              type: "restriction",
              restriction: "cant-quest",
              duration: "this-turn",
              target: {
                reference: "selected-first",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: tiggerHunnyBarbarianP4PromoI18n,
};
