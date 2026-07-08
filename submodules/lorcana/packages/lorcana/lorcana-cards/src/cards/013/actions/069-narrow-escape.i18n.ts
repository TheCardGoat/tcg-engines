import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const narrowEscapeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Narrow Escape",
    text: "Return up to 2 chosen characters, items, or locations with cost 2 or less each to their player's hand.",
  },
  de: {
    name: "Knappes Entkommen",
    text: "Schicke bis zu 2 Charaktere, Gegenstände oder Orte deiner Wahl, die je 2 oder weniger kosten, auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Échapper de justesse",
    text: "Choisissez jusqu'à 2 personnages, objets ou lieux coûtant chacun 2 ou moins et renvoyez-les dans la main de leur propriétaire.",
  },
  it: {
    name: "Scampato Pericolo",
    text: "Fai riprendere in mano ai loro giocatori fino a 2 personaggi, oggetti o luoghi a tua scelta con costo 2 o inferiore ciascuno.",
  },
};
