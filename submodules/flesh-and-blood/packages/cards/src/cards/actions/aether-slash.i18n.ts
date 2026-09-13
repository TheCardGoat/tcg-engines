import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherSlash } from "./aether-slash.ts";

export const aetherSlashI18n = defineFamilyI18n(aetherSlash, {
  en: {
    name: "Aether Slash",
    text: "When Aether Slash attacks, if a 'non-attack' action card was pitched to play it, deal 1 arcane damage to any target.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: aetherSlashRedI18n,
  yellow: aetherSlashYellowI18n,
  blue: aetherSlashBlueI18n,
} = aetherSlashI18n.cards;
