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
        title: "WEIST DEN WEG",
        description: "Deine anderen Bernstein-Charaktere erhalten +2.",
      },
      {
        title: "FREUNDSCHAFTLICHER CHOR",
        description:
          "Solange du mindestens 2 weitere Bernstein-Charaktere im Spiel hast, erhält dieser Charakter Singen 8. (Die Kosten dieses Charakters gelten als 8 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Champion Ambre",
    text: [
      {
        title: "MONTRANT LA VOIE",
        description: "Vos autres personnages Ambre gagnent +2.",
      },
      {
        title: "EN REFRAIN LES AMIS",
        description:
          "Tant que vous avez 2 autres personnages Ambre ou plus en jeu, ce personnage-ci gagne Mélomane 8. (Ce personnage est considéré comme ayant un coût de 8 pour chanter des chansons.)",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Campione d'Ambra",
    text: [
      {
        title: "FARE STRADA I",
        description: "tuoi altri personaggi Ambra ricevono +2.",
      },
      {
        title: "CORO AMICHEVOLE",
        description:
          "Mentre hai in gioco 2 o più altri personaggi Ambra, questo personaggio ottiene Melodioso 8. (Conta come di costo 8 per cantare le canzoni.)",
      },
    ],
  },
};
