import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const imStuckI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I'm Stuck!",
    text: "Chosen exerted character can't ready at the start of their next turn.",
  },
  de: {
    name: "Ich sitze fest!",
    text: "Wähle einen erschöpften Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
  },
  fr: {
    name: "Je suis coincé !",
    text: "Choisissez un personnage épuisé, il ne se redressera pas au début de son prochain tour.",
  },
  it: {
    name: "Sono Bloccato!",
    text: "Un personaggio impegnato a tua scelta non si può preparare all'inizio del suo prossimo turno.",
  },
};
