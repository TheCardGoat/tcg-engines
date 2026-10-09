import type { ActionCard } from "@tcg/lorcana-types";
import { ifSheDoesntScareYouI18n } from "./130-if-she-doesnt-scare-you.i18n";

export const ifSheDoesntScareYou: ActionCard = {
  id: "dTt",
  canonicalId: "ci_dTt",
  slug: "lorcana-ci_dTt",
  printings: [
    {
      id: "set14-130",
      artId: "set14-130",
      setCode: "set14",
      collectorNumber: "130",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-130"],
  cardType: "action",
  name: "If She Doesn't Scare You",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "014",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  text: "Banish chosen character of yours to banish chosen character.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Banish chosen character of yours to banish chosen character.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                requireDifferentTargets: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: ifSheDoesntScareYouI18n,
};
