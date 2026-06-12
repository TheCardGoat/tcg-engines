import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthTalkingClockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Talking Clock",
    text: [
      {
        title: "WAIT A MINUTE",
        description: 'Your characters with Reckless gain "{E} — Gain 1 lore."',
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Sprechende Uhr",
    text: [
      {
        title: "MOMENT MAL",
        description: 'Deine Charaktere mit Impulsiv erhalten: " — Sammle 1 Legende."',
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Horloge parlante",
    text: [
      {
        title: "ATTENDEZ UNE MINUTE",
        description: 'Vos personnages avec Combattant gagnent " — Gagnez 1 éclat de Lore."',
      },
    ],
  },
  it: {
    name: "Tockins",
    version: "Orologio Parlante",
    text: [
      {
        title: "VIENI QUI I",
        description: 'tuoi personaggi con Attaccabrighe ottengono " — ottieni 1 leggenda."',
      },
    ],
  },
};
