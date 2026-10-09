import type { CharacterCard } from "@tcg/lorcana-types";
import { resist } from "../../../helpers/abilities";
import { balooFreightPilotI18n } from "./191-baloo-freight-pilot.i18n";

export const balooFreightPilot: CharacterCard = {
  id: "mVf",
  canonicalId: "ci_mVf",
  slug: "lorcana-ci_mVf",
  printings: [
    {
      id: "set14-191",
      artId: "set14-191",
      setCode: "set14",
      collectorNumber: "191",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-191"],
  cardType: "character",
  name: "Baloo",
  version: "Freight Pilot",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 191,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4996f25eae264a578b050d364524c014",
  },
  text: "Resist +1",
  abilities: [resist(1)],
  classifications: ["Storyborn", "Hero", "Captain"],
  i18n: balooFreightPilotI18n,
};
