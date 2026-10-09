import type { ActionCard } from "@tcg/lorcana-types";
import { neverGonnaLetYouCryI18n } from "./030-never-gonna-let-you-cry.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const neverGonnaLetYouCry: ActionCard = {
  id: "WDL",
  canonicalId: "ci_WDL",
  slug: "lorcana-ci_WDL",
  printings: [
    {
      id: "set14-030",
      artId: "set14-030",
      setCode: "set14",
      collectorNumber: "30",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-030"],
  cardType: "action",
  name: "Never Gonna Let You Cry",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "014",
  cardNumber: 30,
  rarity: "uncommon",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d9724819f8f4be5a547bc0df59ed556",
  },
  text: [
    {
      title: "Sing Together 5",
      description:
        "(Any number of your or your teammates' characters with total cost 5 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Return up to 2 character cards with cost 2 or less each from your discard to your hand.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(5),
    {
      type: "action",
      text: "Return up to 2 character cards with cost 2 or less each from your discard to your hand.",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
          filters: [{ type: "cost-comparison", comparison: "less-or-equal", value: 2 }],
        },
      },
    },
  ],
  i18n: neverGonnaLetYouCryI18n,
};
