import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dunebreakerCenipai } from "./dunebreaker-cenipai.ts";

export const dunebreakerCenipaiI18n = defineFamilyI18n(dunebreakerCenipai, {
  en: {
    name: "Dunebreaker Cenipai",
    typeText: "Draconic Illusionist Action - Attack",
    text: "Phantasm\nWhen Dunebreaker Cenipai is destroyed, create an Ash token.\nGo again",
  },
});

export const {
  red: dunebreakerCenipaiRedI18n,
  yellow: dunebreakerCenipaiYellowI18n,
  blue: dunebreakerCenipaiBlueI18n,
} = dunebreakerCenipaiI18n.cards;
