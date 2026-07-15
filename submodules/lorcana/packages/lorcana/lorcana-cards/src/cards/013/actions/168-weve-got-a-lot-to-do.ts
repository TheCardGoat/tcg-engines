import type { ActionCard } from "@tcg/lorcana-types";
import { weveGotALotToDoI18n } from "./168-weve-got-a-lot-to-do.i18n";

export const weveGotALotToDo: ActionCard = {
  id: "X0p",
  canonicalId: "ci_X0p",
  slug: "lorcana-ci_X0p",
  printings: [
    {
      id: "set13-168",
      artId: "set13-168",
      setCode: "set13",
      collectorNumber: "168",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-168"],
  cardType: "action",
  name: "We've Got a Lot to Do!",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 168,
  rarity: "common",
  cost: 3,
  inkable: true,
  text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Put chosen item or location into its player's inkwell facedown and exerted.",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-card-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item", "location"],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: weveGotALotToDoI18n,
};
