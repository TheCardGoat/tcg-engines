import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcRamp } from "./arc-ramp.ts";

export const arcRampI18n = defineFamilyI18n(arcRamp, {
  en: {
    name: "Arc Ramp",
    text: (_parameter, color) =>
      `Amp ${color === "red" ? 3 : color === "yellow" ? 2 : 1}\nYou may destroy a Lightning Flow you control. If you do, this gets go again.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: arcRampRedI18n,
  yellow: arcRampYellowI18n,
  blue: arcRampBlueI18n,
} = arcRampI18n.cards;
