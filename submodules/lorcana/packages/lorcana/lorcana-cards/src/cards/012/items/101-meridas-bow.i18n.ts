import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meridasBowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merida's Bow",
    text: [
      {
        title: "EASY SHOT",
        description: "When you play this item, deal 1 damage to chosen character.",
      },
      {
        title: "FINAL ARROW 1",
        description: "{I}, Banish this item — Deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Meridas Bogen",
    text: [
      {
        title: "Leichter Schuss",
        description:
          "Wenn du diesen Gegenstand ausspielst, füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
      {
        title: "Letzter Pfeil",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Arc de Merida",
    text: [
      {
        title: "Tir facile",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage et infligez-lui 1 dommage.",
      },
      {
        title: "Dernière flèche",
        description:
          "1 {I}, Bannissez cet objet — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Arco di Merida",
    text: [
      {
        title: "Tiro Semplice",
        description:
          "Quando giochi questo oggetto, infliggi 1 danno a un personaggio a tua scelta.",
      },
      {
        title: "Ultima Freccia",
        description:
          "1 {I}, esilia questo oggetto — Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
