import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lordMacintoshWiryAndHighstrungI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lord Macintosh",
    version: "Wiry and High-Strung",
    text: [
      {
        title: "TOUGH IT OUT",
        description:
          "This character may enter play exerted to give chosen character Resist +2 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Lord Macintosh",
    version: "Drahtig und nervös",
    text: [
      {
        title: "Halte durch",
        description:
          "Du darfst diesen Charakter erschöpft ausspielen, um einem Charakter deiner Wahl in diesem Zug <Robust> +2 zu geben. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Seigneur Macintosh",
    version: "Mince et nerveux",
    text: [
      {
        title: "Prendre sur soi",
        description:
          "Ce personnage peut entrer en jeu épuisé pour donner <Résistance> +2 à un personnage de votre choix jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Lord Macintosh",
    version: "Teso Come una Corda di Violino",
    text: [
      {
        title: "Tieni Duro",
        description:
          "Questo personaggio può entrare in gioco impegnato per dare a un personaggio a tua scelta <Resistere> +2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
