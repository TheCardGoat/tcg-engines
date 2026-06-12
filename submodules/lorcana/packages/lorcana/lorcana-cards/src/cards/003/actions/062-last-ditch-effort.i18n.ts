import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lastditchEffortI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Last-Ditch Effort",
    text: "Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  },
  de: {
    name: "Letzter Versuch",
    text: "Erschöpfe einen gegnerischen Charakter deiner Wahl. Wähle danach einen deiner Charaktere, er erhält in diesem Zug Herausfordern +2. (Während der Charakter herausfordert, erhält er +2).",
  },
  fr: {
    name: "Effort désespéré",
    text: "Choisissez un personnage adverse et épuisez-le. Choisissez ensuite l'un de vos personnages qui gagne Offensif +2 jusqu'à la fin du tour.",
  },
  it: {
    name: "Ultimo Tentativo Disperato",
    text: "Impegna un personaggio avversario a tua scelta. Poi un tuo personaggio a tua scelta ottiene Sfidante +2 per questo turno.",
  },
};
