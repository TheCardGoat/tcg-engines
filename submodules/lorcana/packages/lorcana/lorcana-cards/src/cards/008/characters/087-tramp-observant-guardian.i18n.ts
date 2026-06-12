import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampObservantGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tramp",
    version: "Observant Guardian",
    text: [
      {
        title: "HOW DO I GET IN?",
        description:
          "When you play this character, chosen character gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Strolch",
    version: "Aufmerksamer Wächter",
    text: [
      {
        title: "WIE KOMME ICH DA REIN?",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges Behütet. (Gegnerische Mitspielende können den Charakter nicht auswählen, außer um ihn herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Gardien observateur",
    text: [
      {
        title: "COMMENT ON Y VA?",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Hors d'atteinte jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Guardiano Attento",
    text: [
      {
        title: "COME POSSO ENTRARE?",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Protetto fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
