import type { CharacterCard } from "@tcg/lorcana-types";
import { jockEnjoyingTheSightsI18n } from "./078-jock-enjoying-the-sights.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const jockEnjoyingTheSights: CharacterCard = {
  id: "m0i",
  canonicalId: "ci_m0i",
  slug: "lorcana-ci_m0i",
  printings: [
    {
      id: "set14-078",
      artId: "set14-078",
      setCode: "set14",
      collectorNumber: "78",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-078"],
  cardType: "character",
  name: "Jock",
  version: "Enjoying the Sights",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "014",
  cardNumber: 78,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a25cc25f4ad7487d9abe13d3d1243d4e",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: jockEnjoyingTheSightsI18n,
};
