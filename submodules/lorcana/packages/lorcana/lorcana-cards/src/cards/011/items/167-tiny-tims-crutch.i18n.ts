import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinyTimsCrutchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiny Tim's Crutch",
    text: [
      {
        title: "AT YOUR SIDE",
        description:
          "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Krücke des kleinen Tim",
    text: [
      {
        title: "AN DEINER SEITE",
        description:
          "— Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Béquille de Tiny Tim",
    text: [
      {
        title: "À VOS CÔTÉS",
        description: "— Choisissez un personnage qui gagne Soutien pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Stampella del Piccolo Tim",
    text: [
      {
        title: "AL TUO FIANCO",
        description:
          "— Un personaggio a tua scelta ottiene Aiutante per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
