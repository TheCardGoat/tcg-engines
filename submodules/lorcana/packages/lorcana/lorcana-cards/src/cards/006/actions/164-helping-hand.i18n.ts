import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const helpingHandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Helping Hand",
    text: "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  de: {
    name: "Helfende Hand",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. Ziehe 1 Karte. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Coup de main",
    text: "Choisissez un personnage qui gagne Soutien pour le reste de ce tour. Piochez une carte.",
  },
  it: {
    name: "Dare una mano",
    text: "Un personaggio a tua scelta ottiene Aiutante per questo turno. Pesca una carta. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
  },
};
