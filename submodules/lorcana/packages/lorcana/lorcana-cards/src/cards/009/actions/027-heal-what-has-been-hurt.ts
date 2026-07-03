import type { ActionCard } from "@tcg/lorcana-types";
import { healWhatHasBeenHurtI18n } from "./027-heal-what-has-been-hurt.i18n";

export const healWhatHasBeenHurt: ActionCard = {
  id: "2oM",
  canonicalId: "ci_ol7",
  slug: "lorcana-ci_ol7",
  printings: [
    {
      id: "set9-027",
      artId: "set9-027",
      setCode: "set9",
      collectorNumber: "27",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-026", "set9-027"],
  cardType: "action",
  name: "Heal What Has Been Hurt",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  cardNumber: 27,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d3bdbbdbd842435fa3fa0ac7ec4eb28d",
    tcgPlayer: "649974",
  },
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: {
              type: "up-to",
              value: 3,
            },
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: healWhatHasBeenHurtI18n,
};
