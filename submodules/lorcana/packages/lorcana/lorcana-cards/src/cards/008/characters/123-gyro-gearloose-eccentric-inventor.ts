import type { CharacterCard } from "@tcg/lorcana-types";
import { gyroGearlooseEccentricInventorI18n } from "./123-gyro-gearloose-eccentric-inventor.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const gyroGearlooseEccentricInventor: CharacterCard = {
  id: "mYr",
  canonicalId: "ci_mYr",
  reprints: ["set8-123"],
  cardType: "character",
  name: "Gyro Gearloose",
  version: "Eccentric Inventor",
  inkType: ["ruby", "sapphire"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 123,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3e2e03e343f64fa9ad398cb733b154bd",
    tcgPlayer: 631429,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "I'LL SHOW YOU!",
      description: "When you play this character, chosen opposing character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1fz-2",
      name: "I'LL SHOW YOU!",
      text: "I'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gyroGearlooseEccentricInventorI18n,
};
