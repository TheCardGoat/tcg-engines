import type { CharacterCard } from "@tcg/lorcana-types";
import { mataMeatHutWaitressI18n } from "./182-mata-meat-hut-waitress.i18n";

export const mataMeatHutWaitress: CharacterCard = {
  id: "r0B",
  canonicalId: "ci_r0B",
  slug: "lorcana-ci_r0B",
  printings: [
    {
      id: "set13-182",
      artId: "set13-182",
      setCode: "set13",
      collectorNumber: "182",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-182"],
  cardType: "character",
  name: "Mata",
  version: "Meat Hut Waitress",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 182,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_cb65850b765245e1b3f1e7b4f6a42a5c",
  },
  classifications: ["Storyborn"],
  i18n: mataMeatHutWaitressI18n,
};
