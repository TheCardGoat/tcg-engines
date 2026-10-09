import type { CharacterCard } from "@tcg/lorcana-types";
import { abigailCallaghanSeasonedTestPilotI18n } from "./108-abigail-callaghan-seasoned-test-pilot.i18n";

export const abigailCallaghanSeasonedTestPilot: CharacterCard = {
  id: "RwK",
  canonicalId: "ci_RwK",
  slug: "lorcana-ci_RwK",
  printings: [
    {
      id: "set14-108",
      artId: "set14-108",
      setCode: "set14",
      collectorNumber: "108",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-108"],
  cardType: "character",
  name: "Abigail Callaghan",
  version: "Seasoned Test Pilot",
  inkType: ["ruby"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 108,
  rarity: "common",
  cost: 5,
  strength: 7,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Ally"],
  i18n: abigailCallaghanSeasonedTestPilotI18n,
};
