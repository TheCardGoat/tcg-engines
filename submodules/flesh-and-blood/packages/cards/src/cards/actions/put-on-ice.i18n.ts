import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { putOnIce } from "./put-on-ice.ts";

export const putOnIceI18n = defineFamilyI18n(putOnIce, {
  en: {
    name: "Put on Ice",
    text: (_parameter, color) =>
      `Freeze up to ${color === "red" ? 3 : color === "yellow" ? 2 : 1} target ${color === "blue" ? "ally" : "allies"} until the start of your next turn.\nIf this was played from arsenal, draw a card.\nGo again`,
    typeText: "Ice Action",
  },
});

export const {
  red: putOnIceRedI18n,
  yellow: putOnIceYellowI18n,
  blue: putOnIceBlueI18n,
} = putOnIceI18n.cards;
