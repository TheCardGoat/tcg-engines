import type { CharacterCard } from "@tcg/lorcana-types";
import { winifredExasperatedElephantI18n } from "./084-winifred-exasperated-elephant.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const winifredExasperatedElephant: CharacterCard = {
  id: "2Gw",
  canonicalId: "ci_2Gw",
  slug: "lorcana-ci_2Gw",
  printings: [
    {
      id: "set13-084",
      artId: "set13-084",
      setCode: "set13",
      collectorNumber: "84",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-084"],
  cardType: "character",
  name: "Winifred",
  version: "Exasperated Elephant",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "013",
  cardNumber: 84,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_62bf50e929b74dd99fef99aa21e946bf",
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: winifredExasperatedElephantI18n,
};
