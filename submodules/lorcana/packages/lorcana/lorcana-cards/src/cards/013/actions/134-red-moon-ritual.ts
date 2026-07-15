import type { ActionCard } from "@tcg/lorcana-types";
import { singTogether } from "../../../helpers/abilities/singTogether";
import { redMoonRitualI18n } from "./134-red-moon-ritual.i18n";

export const redMoonRitual: ActionCard = {
  id: "9IV",
  canonicalId: "ci_9IV",
  slug: "lorcana-ci_9IV",
  printings: [
    {
      id: "set13-134",
      artId: "set13-134",
      setCode: "set13",
      collectorNumber: "134",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-134"],
  cardType: "action",
  name: "Red Moon Ritual",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_6013913b9e9844dc99676cc81c05ca10",
  },
  text: [
    {
      title: "Sing Together 7",
      description:
        "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
    },
    {
      title: "Banish chosen character.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(7),
    {
      type: "action",
      text: "Banish chosen character.",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: redMoonRitualI18n,
};
