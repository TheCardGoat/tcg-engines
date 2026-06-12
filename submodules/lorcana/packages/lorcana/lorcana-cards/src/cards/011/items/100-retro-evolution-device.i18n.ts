import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const retroEvolutionDeviceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Retro Evolution Device",
    text: [
      {
        title: "TURN INTO DINOSAUR",
        description:
          "{E}, 1 {I}, Banish chosen character of yours — Play a character with cost up to 2 more than the banished character for free.",
      },
    ],
  },
  de: {
    name: "Evolutions-Umkehr-Gerät",
    text: [
      {
        title: "DINOSAURIERVERWANDLUNG, 1,",
        description:
          "Wähle und verbanne einen deiner Charaktere — Spiele einen Charakter, der bis zu 2 mehr als der verbannte Charakter kostet, kostenlos aus.",
      },
    ],
  },
  fr: {
    name: "Rétro-fusil à évolution",
    text: [
      {
        title: "TRANSFORMER EN DINOSAURE, 1,",
        description:
          "Choisissez l'un de vos personnages et bannissez-le — Jouez gratuitement un personnage coûtant jusqu'à 2 de plus que le personnage banni.",
      },
    ],
  },
  it: {
    name: "Apparecchio Retroevolutore",
    text: [
      {
        title: "TRASFORMARE IN DINOSAURO, 1,",
        description:
          "esilia un tuo personaggio a tua scelta — Gioca un personaggio con costo fino a 2 in più rispetto a quello del personaggio esiliato, gratis.",
      },
    ],
  },
};
