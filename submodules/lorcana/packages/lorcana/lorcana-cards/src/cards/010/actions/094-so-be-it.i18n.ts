import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const soBeItI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "So Be It!",
    text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
  },
  de: {
    name: "So sei es!",
    text: "Deine Charaktere erhalten in diesem Zug +1. Du darfst einen Gegenstand deiner Wahl verbannen.",
  },
  fr: {
    name: "Alors tant pis !",
    text: "Chacun de vos personnages gagne +1 pour le reste de ce tour. Vous pouvez choisir un objet et le bannir.",
  },
  it: {
    name: "Ebbene Sia!",
    text: "Ogni tuo personaggio riceve +1 per questo turno. Puoi esiliare un oggetto a tua scelta.",
  },
};
