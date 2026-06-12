import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzSpunkySpeedsterI18n } from "./124-vanellope-von-schweetz-spunky-speedster.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const vanellopeVonSchweetzSpunkySpeedster: CharacterCard = {
  id: "SCj",
  canonicalId: "ci_SCj",
  reprints: ["set8-124"],
  cardType: "character",
  name: "Vanellope Von Schweetz",
  version: "Spunky Speedster",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 124,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3b52c05d999944679005cd5fe94c2adb",
    tcgPlayer: 631430,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
  abilities: [evasive],
  i18n: vanellopeVonSchweetzSpunkySpeedsterI18n,
};
