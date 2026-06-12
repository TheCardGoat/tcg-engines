import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gyroevacI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gyro-Evac",
    text: [
      {
        title: "TAKE HER UP",
        description:
          "{E}, 1 {I} — Chosen character of yours gains Evasive until the start of your next turn.",
      },
      {
        title: "CRASH LANDING",
        description: "{E}, Banish this item — Each player loses 2 lore.",
      },
    ],
  },
  de: {
    name: "Gyro-Evac",
    text: [
      {
        title: "Wir starten",
        description:
          "{E}, 1 {I} — Wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
      {
        title: "Bruchlandung",
        description:
          "{E}, Verbanne diesen Gegenstand — Alle Mitspielenden (auch du) verlieren je 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Gyro-Evac",
    text: [
      {
        title: "On décolle",
        description:
          "{E}, 1 {I} — Choisissez l'un de vos personnages qui gagne <Insaisissable> jusqu'au début de votre prochain tour. (Seuls les personnages avec Insaisissable peuvent défier ce personnage-là.)",
      },
      {
        title: "Atterrissage en crash",
        description: "{E}, Bannissez cet objet — Chaque joueur perd 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Scialuppa a Pale Rotanti",
    text: [
      {
        title: "Andiamo",
        description:
          "{E}, 1 {I} — Un tuo personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "Atterraggio di Fortuna",
        description: "{E}, esilia questo oggetto — Ogni giocatore perde 2 leggenda.",
      },
    ],
  },
};
