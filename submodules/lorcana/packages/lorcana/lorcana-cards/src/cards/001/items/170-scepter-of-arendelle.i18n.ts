import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scepterOfArendelleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scepter of Arendelle",
    text: [
      {
        title: "COMMAND",
        description:
          "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Zepter von Arendelle",
    text: [
      {
        title: "BEFEHL",
        description:
          "— Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "SCEPTRE D'ARENDELLE",
    text: [
      {
        title: "COMMANDEMENT",
        description: "— choisissez un personnage, il gagne Soutien pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scettro di Arendelle",
    text: [
      {
        title: "COMANDO",
        description:
          "— Un personaggio a tua scelta ottiene Aiutante per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
