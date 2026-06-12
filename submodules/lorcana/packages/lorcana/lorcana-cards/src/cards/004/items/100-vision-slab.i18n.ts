import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const visionSlabI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vision Slab",
    text: [
      {
        title: "DANGER REVEALED",
        description: "At the start of your turn, if an opposing character has damage, gain 1 lore.",
      },
      {
        title: "TRAPPED!",
        description: "Damage counters can't be removed.",
      },
    ],
  },
  de: {
    name: "Visionsplatte",
    text: [
      {
        title: "ENTHÜLLTE GEFAHR",
        description:
          "Zu Beginn deines Zuges, wenn mindestens eine gegnerische Person einen beschädigten Charakter im Spiel hat, sammelst du 1 Legende.",
      },
      {
        title: "IN DER FALLE!",
        description: "Schadensmarker können nicht entfernt werden.",
      },
    ],
  },
  fr: {
    name: "Plaque de vision",
    text: [
      {
        title: "DANGER RÉVÉLÉ",
        description:
          "Au début de votre tour, si un personnage adverse a au moins un jeton Dommage, gagnez 1 éclat de Lore.",
      },
      {
        title: "PIÉGÉ!",
        description: "Aucun jeton Dommage ne peut être retiré.",
      },
    ],
  },
  it: {
    name: "Tavoletta della Visione",
    text: [
      {
        title: "PERICOLO RIVELATO",
        description:
          "All'inizio del tuo turno, se un personaggio avversario è danneggiato, ottieni 1 leggenda.",
      },
      {
        title: "IN TRAPPOLA!",
      },
      {
        title: "I",
        description: "segnalini danno non possono essere rimossi.",
      },
    ],
  },
};
