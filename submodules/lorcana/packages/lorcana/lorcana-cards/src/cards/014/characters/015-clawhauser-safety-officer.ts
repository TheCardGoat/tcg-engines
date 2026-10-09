import type { CharacterCard } from "@tcg/lorcana-types";
import { clawhauserSafetyOfficerI18n } from "./015-clawhauser-safety-officer.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const clawhauserSafetyOfficer: CharacterCard = {
  id: "Hfj",
  canonicalId: "ci_Hfj",
  slug: "lorcana-ci_Hfj",
  printings: [
    {
      id: "set14-015",
      artId: "set14-015",
      setCode: "set14",
      collectorNumber: "15",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-015"],
  cardType: "character",
  name: "Clawhauser",
  version: "Safety Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 15,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Everyone's Buddy",
      description: "You can't play this character unless you played another character this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [
    bodyguard,
    {
      id: "Hfj-2",
      name: "Everyone's Buddy",
      type: "static",
      sourceZones: ["hand"],
      text: "Everyone's Buddy You can't play this character unless you played another character this turn.",
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
        excludeSource: true,
      },
      effect: {
        type: "self-play-condition",
      },
    },
  ],
  i18n: clawhauserSafetyOfficerI18n,
};
