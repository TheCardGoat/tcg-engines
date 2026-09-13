import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chartACourse } from "./chart-a-course.ts";

export const chartACourseI18n = defineFamilyI18n(chartACourse, {
  en: {
    name: "Chart a Course",
    text: "Your first attack this turn gets +3{p}.\nYou may put a gold counter on Treasure Island.\nGo again",
    typeText: "Pirate Action",
  },
});

export const {
  red: chartACourseRedI18n,
  yellow: chartACourseYellowI18n,
  blue: chartACourseBlueI18n,
} = chartACourseI18n.cards;
