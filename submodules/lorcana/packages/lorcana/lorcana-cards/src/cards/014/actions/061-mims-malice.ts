import type { ActionCard } from "@tcg/lorcana-types";
import { mimsMaliceI18n } from "./061-mims-malice.i18n";

export const mimsMalice: ActionCard = {
  id: "rWy",
  canonicalId: "ci_rWy",
  slug: "lorcana-ci_rWy",
  printings: [
    {
      id: "set14-061",
      artId: "set14-061",
      setCode: "set14",
      collectorNumber: "61",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-061"],
  cardType: "action",
  name: "Mim's Malice",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 61,
  rarity: "common",
  cost: 2,
  inkable: true,
  text: "Move up to 3 damage from chosen character to chosen opposing character.",
  abilities: [
    {
      type: "action",
      text: "Move up to 3 damage from chosen character to chosen opposing character.",
      effect: {
        type: "move-damage",
        amount: {
          type: "up-to",
          value: 3,
        },
        from: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: mimsMaliceI18n,
};
