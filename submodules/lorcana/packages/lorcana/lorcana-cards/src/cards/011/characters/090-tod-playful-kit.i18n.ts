import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const todPlayfulKitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tod",
    version: "Playful Kit",
    text: [
      {
        title: "LOOK AT THIS!",
        description: "Whenever this character quests, choose one:",
      },
      {
        title: "* Gain 1 lore.",
      },
      {
        title: "* Chosen character of yours gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Cap",
    version: "Verspielter Welpe",
    text: [
      {
        title: "SIEH DIR DAS AN!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wähle eine Möglichkeit aus: • Sammle 1 Legende. • Wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "Rox",
    version: "Renardeau joueur",
    text: [
      {
        title: "REGARDE ÇA!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez entre: • Gagnez 1 éclat de Lore. • Choisissez l'un de vos personnages qui gagne Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Red",
    version: "Cucciolo Giocoso",
    text: [
      {
        title: "GUARDA QUESTO!",
        description:
          "Ogni volta che questo personaggio va all'avventura, scegli uno: • Ottieni 1 leggenda. • Un tuo personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
