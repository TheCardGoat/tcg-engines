import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const piercingAttackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Piercing Attack",
    text: "Deal 2 damage to chosen character. This damage can't be reduced by Resist.",
  },
  de: {
    name: "Durchdringende Attacke",
    text: "Füge einem Charakter deiner Wahl 2 Schaden zu. Dieser Schaden kann nicht durch <Robust> reduziert werden.",
  },
  fr: {
    name: "Attaque perforante",
    text: "Choisissez un personnage et infligez-lui 2 dommages. Ces dommages ne sont pas réduits par <Résistance>.",
  },
  it: {
    name: "Attacco Perforante",
    text: "Infliggi 2 danni a un personaggio a tua scelta. Questo danno non può essere ridotto da <Resistere>.",
  },
};
