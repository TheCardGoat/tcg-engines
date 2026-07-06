import type { ActionCard } from "@tcg/lorcana-types";
import { youveGotSomePunchI18n } from "./064-youve-got-some-punch.i18n";

export const youveGotSomePunch: ActionCard = {
  id: "dYy",
  canonicalId: "ci_dYy",
  slug: "lorcana-ci_dYy",
  printings: [
    {
      id: "set13-064",
      artId: "set13-064",
      setCode: "set13",
      collectorNumber: "64",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-064"],
  cardType: "action",
  name: "You've Got Some Punch",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 64,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c42cf87af57a4bb4923dfbcdc9792b99",
  },
  text: "Chosen character gains rush and Challenger +2 this turn. (They can challenge the turn they're played. They get +2 strength while challenging.)",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Rush",
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: youveGotSomePunchI18n,
};
