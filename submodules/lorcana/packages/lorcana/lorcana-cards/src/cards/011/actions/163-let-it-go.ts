import type { ActionCard } from "@tcg/lorcana-types";
import { letItGoI18n } from "./163-let-it-go.i18n";

export const letItGo: ActionCard = {
  id: "xdR",
  canonicalId: "ci_xdR",
  slug: "lorcana-ci_xdR",
  printings: [
    {
      id: "set11-163",
      artId: "set11-163",
      setCode: "set11",
      collectorNumber: "163",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-163", "set11-163"],
  cardType: "action",
  name: "Let It Go",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 163,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e294ae586f24eddae3b7d1263c73ee7",
    tcgPlayer: "674692",
  },
  text: "Put chosen character into their player's inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CHOSEN_CHARACTER",
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: letItGoI18n,
};
