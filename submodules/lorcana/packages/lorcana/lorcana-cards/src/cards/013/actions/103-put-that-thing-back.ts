import type { ActionCard } from "@tcg/lorcana-types";
import { putThatThingBackI18n } from "./103-put-that-thing-back.i18n";

export const putThatThingBack: ActionCard = {
  id: "qbi",
  canonicalId: "ci_qbi",
  slug: "lorcana-ci_qbi",
  printings: [
    {
      id: "set13-103",
      artId: "set13-103",
      setCode: "set13",
      collectorNumber: "103",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-103"],
  cardType: "action",
  name: "Put That Thing Back",
  inkType: ["emerald"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 103,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_44225a9fb50548479dbb5730fd53a88e",
  },
  text: "Return chosen character or item to their player's hand.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Return chosen character or item to their player's hand.",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "item"],
        },
      },
    },
  ],
  i18n: putThatThingBackI18n,
};
