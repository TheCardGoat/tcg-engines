import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mysticalRoseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mystical Rose",
    text: [
      {
        title: "DISPEL THE ENTANGLEMENT",
        description:
          "Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Geheimnisvolle Rose",
    text: [
      {
        title: "Die Verstrickung auflösen",
        description:
          "Verbanne diesen Gegenstand — Gib einem Biest-Charakter deiner Wahl in diesem Zug +2 {L}. Wenn du einen Belle-Charakter im Spiel hast, verschiebe bis zu 3 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Rose mystique",
    text: [
      {
        title: "Dissiper l'envoutement",
        description:
          "Bannissez cet objet — Choisissez un personnage La Bête qui gagne +2 {L} pour le reste de ce tour. Si vous avez un personnage Belle en jeu, choisissez un personnage et déplacez jusqu'à 3 de ses jetons Dommage sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Rosa Incantata",
    text: [
      {
        title: "Sciogliere il Groviglio",
        description:
          "Esilia questo oggetto — Un personaggio a tua scelta chiamato La Bestia riceve +2 {L} per questo turno. Se hai in gioco un personaggio chiamato Belle, sposta fino a 3 segnalini danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "Rosa mística",
    text: [
      {
        title: "DISPIRA EL ENREDO",
        description:
          "Desterrar este objeto: el personaje elegido llamado Bestia obtiene +2 {L} este turno. Si tienes un personaje llamado Bella en juego, mueve hasta 3 contadores de daño del personaje elegido al personaje contrario elegido.",
      },
    ],
  },
};
