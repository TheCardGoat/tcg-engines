import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const buzzsArmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Buzz's Arm",
    text: [
      {
        title: "MISSING PIECE",
        description:
          "If a character named Buzz Lightyear was banished this turn, you may play this item for free.",
      },
      {
        title: "SOME ASSEMBLY REQUIRED",
        description: "{E} — You pay 1 {I} less for the next action or item you play this turn.",
      },
    ],
  },
  de: {
    name: "Buzz’ Arm",
    text: [
      {
        title: "Fehlendes Teil",
        description:
          "Falls in diesem Zug ein Buzz-Lightyear-Charakter verbannt wurde, darfst du diesen Gegenstand kostenlos ausspielen.",
      },
      {
        title: "Montage erforderlich",
        description:
          "{E} — Du zahlst 1 {I} weniger für die nächste Aktion oder den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Bras de Buzz",
    text: [
      {
        title: "Pièce manquante",
        description:
          "Vous pouvez jouer cet objet gratuitement si un personnage nommé Buzz l'Éclair a été banni ce tour-ci.",
      },
      {
        title: "Assemblage nécessaire",
        description:
          "{E} — La prochaine action ou le prochain objet que vous jouez ce tour-ci vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Braccio di Buzz",
    text: [
      {
        title: "Parte Mancante",
        description:
          "Se un personaggio chiamato Buzz Lightyear è stato esiliato in questo turno, puoi giocare questo oggetto gratis.",
      },
      {
        title: "Bisogna Assemblarlo",
        description:
          "{E} — Paga 1 {I} in meno per giocare la tua prossima azione o il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
};
