import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampObservantGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tramp",
    version: "Observant Guardian",
    text: [
      {
        title: "HOW DO",
        description:
          "I GET IN? When you play this character, chosen character gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Strolch",
    version: "Aufmerksamer Wächter",
    text: [
      {
        title: "Wie komme ich da rein?",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges <Behütet>. (Gegnerische Mitspielende können den Charakter nicht auswählen, außer um ihn herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Gardien observateur",
    text: [
      {
        title: "Comment on y va?",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Hors d'atteinte> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Guardiano Attento",
    text: [
      {
        title: "Come Posso Entrare?",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Protetto> fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Vagabundo",
    version: "Guardián observador",
    text: [
      {
        title: "¿CÓMO HACER?",
        description:
          "¿ME ENTRO? Cuando juegas con este personaje, el personaje elegido gana Protección hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
