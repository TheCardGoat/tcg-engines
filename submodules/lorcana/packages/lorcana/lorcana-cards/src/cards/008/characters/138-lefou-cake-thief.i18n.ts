import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lefouCakeThiefI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "LeFou",
    version: "Cake Thief",
    text: [
      {
        title: "ALL FOR ME",
        description:
          "{E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Le Fou",
    version: "Kuchendieb",
    text: [
      {
        title: "ALLES",
        description:
          "FÜR MICH, Verbanne einen deiner Gegenstände — Eine gegnerische Person deiner Wahl verliert 1 Legende und du sammelst 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Le Fou",
    version: "Voleur de gâteau",
    text: [
      {
        title: "TOUT POUR MOI,",
        description:
          "bannissez l'un de vos objets — Choisissez un adversaire qui perd 1 éclat de Lore et vous gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Le Tont",
    version: "Ladro di Torte",
    text: [
      {
        title: "TUTTA PER ME,",
        description:
          "esilia uno dei tuoi oggetti — Un avversario a tua scelta perde 1 leggenda e tu ottieni 1 leggenda.",
      },
    ],
  },
};
