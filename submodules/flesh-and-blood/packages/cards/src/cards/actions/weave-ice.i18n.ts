import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { weaveIce } from "./weave-ice.ts";

export const weaveIceI18n = defineFamilyI18n(weaveIce, {
  en: {
    name: "Weave Ice",
    text: (_parameter, color) =>
      `The next Ice or Elemental attack action card you play this turn gains +${color === "red" ? 3 : color === "yellow" ? 2 : 1}{p}.\nIf it's fused, it gains dominate.\nGo again`,
    typeText: "Ice Action",
  },
});

export const {
  red: weaveIceRedI18n,
  yellow: weaveIceYellowI18n,
  blue: weaveIceBlueI18n,
} = weaveIceI18n.cards;
