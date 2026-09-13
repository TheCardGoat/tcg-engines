import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { nebulaDuality } from "./nebula-duality.ts";

export const nebulaDualityI18n = defineFamilyI18n(nebulaDuality, {
  en: {
    name: "Nebula Duality",
    text: (_parameter, color) =>
      `Deal ${color === "red" ? 1 : color === "yellow" ? 2 : 3} arcane damage to any target.\nInstant - {r}, discard this: Deal 1 arcane damage to target hero. Create a Lightning Flow token.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: nebulaDualityRedI18n,
  yellow: nebulaDualityYellowI18n,
  blue: nebulaDualityBlueI18n,
} = nebulaDualityI18n.cards;
