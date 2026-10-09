import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const airDropI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Air Drop",
    text: "Deal 3 damage to chosen character. If that character has damage, deal 5 damage instead.",
  },
  de: {
    name: "Luftabwurf",
    text: "Füge einem Charakter deiner Wahl 3 Schaden zu. Falls der gewählte Charakter beschädigt ist, füge ihm stattdessen 5 Schaden zu.",
  },
  fr: {
    name: "Largage aérien",
    text: "Choisissez un personnage et infligez-lui 3 dommages. Si ce personnage a au moins un dommage, infligez-lui 5 dommages à la place.",
  },
  it: {
    name: "Consegna Aerea",
    text: "Infliggi 3 danni a un personaggio a tua scelta. Se quel personaggio ha danno, infliggi invece 5 danni.",
  },
  es: {
    name: "Air Drop",
    text: "Deal 3 damage to chosen character. If that character has damage, deal 5 damage instead.",
  },
};
