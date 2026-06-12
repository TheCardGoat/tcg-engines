import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const promisingLeadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Promising Lead",
    text: "Chosen character gets +1 {L} and gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  },
  de: {
    name: "Vielversprechender Hinweis",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +1 und Unterstützen. (Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Piste prometteuse",
    text: "Choisissez un personnage qui gagne +1 et Soutien pour le reste de ce tour.",
  },
  it: {
    name: "Pista Promettente",
    text: "Un personaggio a tua scelta riceve +1 e ottiene Aiutante per questo turno. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
  },
};
