import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyExtremeAthleteI18n } from "./139-goofy-extreme-athlete.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const goofyExtremeAthlete: CharacterCard = {
  id: "3Ct",
  canonicalId: "ci_3Ct",
  reprints: ["set7-139"],
  cardType: "character",
  name: "Goofy",
  version: "Extreme Athlete",
  inkType: ["ruby"],
  set: "007",
  cardNumber: 139,
  rarity: "common",
  cost: 7,
  strength: 7,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f51072d030ba4e7b892f9ae48175f4cb",
    tcgPlayer: 619484,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "STAR POWER",
      description:
        "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      id: "15u-2",
      name: "STAR POWER",
      text: "STAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofyExtremeAthleteI18n,
};
