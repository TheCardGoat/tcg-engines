import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const potOfHoneyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pot of Honey",
    text: [
      {
        title: "I'M STUCK!",
        description:
          "Banish this item — Chosen exerted character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Honigtopf",
    text: [
      {
        title: "ICH SITZE FEST!",
        description:
          "Verbanne diesen Gegenstand — Wähle einen erschöpften Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Pot de miel",
    text: [
      {
        title: "JE SUIS",
        description:
          "COINCÉ! Bannissez cet objet — Choisissez un personnage épuisé qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Vasetto di Miele",
    text: [
      {
        title: "SONO BLOCCATO!",
        description:
          "Esilia questo oggetto — Un personaggio impegnato a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
