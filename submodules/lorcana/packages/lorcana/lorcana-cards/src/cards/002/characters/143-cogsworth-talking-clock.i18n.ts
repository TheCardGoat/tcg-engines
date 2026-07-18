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
        title: "Moment mal",
        description: 'Deine Charaktere mit <Impulsiv> erhalten: "{E} — Sammle 1 Legende."',
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Horloge parlante",
    text: [
      {
        title: "Attendez une minute",
        description: 'Vos personnages avec <Combattant> gagnent "{E} — Gagnez 1 éclat de Lore."',
      },
    ],
  },
  it: {
    name: "Tockins",
    version: "Orologio Parlante",
    text: [
      {
        title: "Vieni Qui",
        description: 'I tuoi personaggi con <Attaccabrighe> ottengono "{E} — ottieni 1 leggenda."',
      },
    ],
  },
  es: {
    name: "Diente",
    version: "Reloj parlante",
    text: [
      {
        title: "ESPERA UN MINUTO",
        description: 'Tus personajes con Reckless obtienen "{E} — Gana 1 conocimiento".',
      },
    ],
  },
};
