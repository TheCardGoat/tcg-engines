import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseAmberChampionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Amber Champion",
    text: [
      {
        title: "LEADING THE WAY",
        description: "Your other Amber characters get +2 {W}.",
      },
      {
        title: "FRIENDLY CHORUS",
        description:
          "While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Bernstein-Champion",
    text: [
      {
        title: "Weist den Weg",
        description: "Deine anderen Bernstein-Charaktere erhalten +2 {W}.",
      },
      {
        title: "Freundschaftlicher Chor",
        description:
          "Solange du mindestens 2 weitere Bernstein-Charaktere im Spiel hast, erhält dieser Charakter <Singen> 8. (Die Kosten dieses Charakters gelten als 8 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Champion Ambre",
    text: [
      {
        title: "Montrant la voie",
        description: "Vos autres personnages Ambre gagnent +2 {W}.",
      },
      {
        title: "En refrain les amis",
        description:
          "Tant que vous avez 2 autres personnages Ambre ou plus en jeu, ce personnage-ci gagne <Mélomane> 8. (Ce personnage est considéré comme ayant un coût de 8 pour chanter des chansons.)",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Campione d'Ambra",
    text: [
      {
        title: "Fare Strada",
        description: "I tuoi altri personaggi Ambra ricevono +2 {W}.",
      },
      {
        title: "Coro Amichevole",
        description:
          "Mentre hai in gioco 2 o più altri personaggi Ambra, questo personaggio ottiene <Melodioso> 8. (Conta come di costo 8 per cantare le canzoni.)",
      },
    ],
  },
  es: {
    name: "Ratoncito Mickey",
    version: "Campeón ámbar",
    text: [
      {
        title: "LIDERANDO EL CAMINO",
        description: "Tus otros personajes de Amber obtienen +2 {W}.",
      },
      {
        title: "CORO AMISTOSO",
        description:
          "Mientras tengas 2 o más personajes de Amber en juego, este personaje obtiene Cantante 8 (cuentan como un costo de 8 para cantar canciones).",
      },
    ],
  },
};
