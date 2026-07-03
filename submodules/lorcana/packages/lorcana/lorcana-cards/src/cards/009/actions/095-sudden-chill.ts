import type { ActionCard } from "@tcg/lorcana-types";
import { suddenChillI18n } from "./095-sudden-chill.i18n";

export const suddenChill: ActionCard = {
  id: "p2W",
  canonicalId: "ci_72X",
  slug: "lorcana-ci_72X",
  printings: [
    {
      id: "set9-095",
      artId: "set9-095",
      setCode: "set9",
      collectorNumber: "95",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-098", "set9-095"],
  cardType: "action",
  name: "Sudden Chill",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "009",
  cardNumber: 95,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_541fd75946914a688a54b5fc5f1d966d",
    tcgPlayer: "650033",
  },
  text: "Each opponent chooses and discards a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: "EACH_OPPONENT",
        type: "discard",
      },
    },
  ],
  i18n: suddenChillI18n,
};
