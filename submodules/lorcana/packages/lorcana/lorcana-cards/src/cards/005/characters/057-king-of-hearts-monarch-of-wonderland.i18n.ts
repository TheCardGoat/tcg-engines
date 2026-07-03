import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kingOfHeartsMonarchOfWonderlandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "King of Hearts",
    version: "Monarch of Wonderland",
    text: [
      {
        title: "PLEASING THE QUEEN",
        description: "{E} — Chosen exerted character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Herzkönig",
    version: "Monarch des Wunderlands",
    text: [
      {
        title: "Huldigt der Königin",
        description:
          "{E} — Wähle einen erschöpften Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Le Roi de Cœur",
    version: "Monarque du Pays des Merveilles",
    text: [
      {
        title: "Écoutez la Reine!",
        description:
          "{E} — Choisissez un personnage épuisé qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Re di Cuori",
    version: "Monarca del Paese delle Meraviglie",
    text: [
      {
        title: "Compiacere la Regina",
        description:
          "{E} — Un personaggio impegnato a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
