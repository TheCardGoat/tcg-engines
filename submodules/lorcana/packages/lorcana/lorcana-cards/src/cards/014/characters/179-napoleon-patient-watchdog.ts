import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities/alert";
import { napoleonPatientWatchdogI18n } from "./179-napoleon-patient-watchdog.i18n";

export const napoleonPatientWatchdog: CharacterCard = {
  id: "t66",
  canonicalId: "ci_t66",
  slug: "lorcana-ci_t66",
  printings: [
    {
      id: "set14-179",
      artId: "set14-179",
      setCode: "set14",
      collectorNumber: "179",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-179"],
  cardType: "character",
  name: "Napoleon",
  version: "Patient Watchdog",
  inkType: ["steel"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 179,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_116f3c8f3d3e4234a3fd146c61d8904f",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [alert],
  i18n: napoleonPatientWatchdogI18n,
};
