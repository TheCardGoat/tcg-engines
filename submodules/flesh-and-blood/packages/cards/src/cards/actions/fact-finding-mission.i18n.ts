import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { factFindingMission } from "./fact-finding-mission.ts";

export const factFindingMissionI18n = defineFamilyI18n(factFindingMission, {
  en: {
    name: "Fact-Finding Mission",
    typeText: "Generic Action - Attack",
    text: "When this hits a hero, you may look at a face-down card in their arsenal or equipment zones.",
  },
});

export const {
  red: factFindingMissionRedI18n,
  yellow: factFindingMissionYellowI18n,
  blue: factFindingMissionBlueI18n,
} = factFindingMissionI18n.cards;
