import type { ActionCard } from "@tcg/lorcana-types";
import { wellSaveOurVillageI18n } from "./199-well-save-our-village.i18n";

export const wellSaveOurVillage: ActionCard = {
  id: "zjC",
  canonicalId: "ci_zjC",
  slug: "lorcana-ci_zjC",
  printings: [
    {
      id: "set13-199",
      artId: "set13-199",
      setCode: "set13",
      collectorNumber: "199",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-199"],
  cardType: "action",
  name: "We'll Save Our Village",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 199,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9e9490d267af46ea9959b45ea5eeaee8",
  },
  text: "Your characters and locations gain Resist +1 until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Your characters and locations gain Resist +1 until the start of your next turn.",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        duration: "until-start-of-next-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character", "location"],
        },
      },
    },
  ],
  i18n: wellSaveOurVillageI18n,
};
