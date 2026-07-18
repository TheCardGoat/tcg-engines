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
        title: "Doctrina Adducere",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Charakter erschöpft wird, sammelst du 1 Legende.",
      },
      {
        title: "Celeritas",
        description:
          "Deine Demona-Charaktere erhalten <Rasant>. (Die Charaktere können im selben Zug herausfordern, in dem sie ausgespielt werden.)",
      },
    ],
  },
  fr: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "Doctrina Adducere",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse devient épuisé, gagnez 1 éclat de Lore.",
      },
      {
        title: "Celeritas",
        description:
          "Vos personnages nommés Démona gagnent <Charge>. (Ces personnages peuvent défier le tour où ils sont joués.)",
      },
    ],
  },
  it: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "Doctrina Adducere",
        description:
          "Durante il tuo turno, ogni volta che un personaggio avversario viene impegnato, ottieni 1 leggenda.",
      },
      {
        title: "Celeritas",
        description:
          "I tuoi personaggi chiamati Demona ottengono <Lesto>. (Possono sfidare nel turno in cui vengono giocati.)",
      },
    ],
  },
  es: {
    name: "Grimorum Arcanorum",
    text: [
      {
        title: "DOCTRINA ADUCTORA",
        description:
          "Durante tu turno, cada vez que un personaje contrario se vea estresado, gana 1 conocimiento.",
      },
      {
        title: "CELERITAS",
        description:
          "Tus personajes llamados Demona obtienen Rush. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
