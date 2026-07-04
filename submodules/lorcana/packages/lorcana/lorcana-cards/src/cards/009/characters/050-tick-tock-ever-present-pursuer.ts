import type { CharacterCard } from "@tcg/lorcana-types";
import { ticktockEverpresentPursuerI18n } from "./050-tick-tock-ever-present-pursuer.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const ticktockEverpresentPursuer: CharacterCard = {
  id: "PQe",
  canonicalId: "ci_UpL",
  slug: "lorcana-ci_UpL",
  printings: [
    {
      id: "set9-050",
      artId: "set9-050",
      setCode: "set9",
      collectorNumber: "50",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-056", "set9-050"],
  cardType: "character",
  name: "Tick-Tock",
  version: "Ever-Present Pursuer",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "009",
  cardNumber: 50,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cefa62e7a0f246dd81c4c7628c3c054c",
    tcgPlayer: "649994",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: ticktockEverpresentPursuerI18n,
};
