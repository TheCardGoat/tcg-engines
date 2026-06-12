import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bosssOrdersI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Boss's Orders",
    text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  de: {
    name: "Befehl vom Boss",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Ordres de la patronne",
    text: "Choisissez un personnage, il gagne Soutien pour le reste de ce tour.",
  },
  it: {
    name: "Ordini del Boss",
    text: "Un personaggio a tua scelta ottiene Aiutante per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
  },
};
