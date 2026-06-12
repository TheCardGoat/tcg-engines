import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grimorumArcanorumI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "DOCTRINA ADDUCERE",
        description:
          "During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
      },
      {
        title: "CELERITAS",
        description:
          "Your characters named Demona gain Rush. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "DOCTRINA ADDUCERE",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Charakter erschöpft wird, sammelst du 1 Legende.",
      },
      {
        title: "CELERITAS",
        description:
          "Deine Demona-Charaktere erhalten Rasant. (Die Charaktere können im selben Zug herausfordern, in dem sie ausgespielt werden.)",
      },
    ],
  },
  fr: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "DOCTRINA ADDUCERE",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse devient épuisé, gagnez 1 éclat de Lore.",
      },
      {
        title: "CELERITAS",
        description:
          "Vos personnages nommés Démona gagnent Charge. (Ces personnages peuvent défier le tour où ils sont joués.)",
      },
    ],
  },
  it: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "DOCTRINA ADDUCERE",
        description:
          "Durante il tuo turno, ogni volta che un personaggio avversario viene impegnato, ottieni 1 leggenda.",
      },
      {
        title: "CELERITAS I",
        description:
          "tuoi personaggi chiamati Demona ottengono Lesto. (Possono sfidare nel turno in cui vengono giocati.)",
      },
    ],
  },
};
