import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrsIncredibleDeterminedRescuerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mrs. Incredible",
    version: "Determined Rescuer",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "PULL BACK",
        description: "Your characters gain Resist +1.",
      },
      {
        title: "REGROUP",
        description:
          "During your turn, whenever another character is banished in a challenge, you may ready chosen Super character. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Mrs. Incredible",
    version: "Entschlossene Retterin",
    text: [
      {
        title: "<Gestaltwandel> 5 {I}",
      },
      {
        title: "Zurückziehen",
        description: "Deine Charaktere erhalten <Robust> +1.",
      },
      {
        title: "Neu formieren",
        description:
          "Jedes Mal während deines Zuges, wenn ein anderer Charakter durch eine Herausforderung verbannt wird, darfst du einen Super deiner Wahl bereit machen. Wenn du dies tust, kann er in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Mme Indestructible",
    version: "Sauveteuse déterminée",
    text: [
      {
        title: "<Alter> 5 {I}",
      },
      {
        title: "Repli",
        description: "Vos personnages gagnent <Résistance> +1.",
      },
      {
        title: "Regroupement",
        description:
          "Durant votre tour, chaque fois qu'un autre personnage est banni via un défi, vous pouvez choisir un personnage Super et le redresser. Si vous le faites, ce personnage-là ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mrs. Incredibile",
    version: "Salvatrice Determinata",
    text: [
      {
        title: "<Trasformazione> 5 {I}",
      },
      {
        title: "Ritirarsi",
        description: "I tuoi personaggi ottengono <Resistere> +1.",
      },
      {
        title: "Riorganizzarsi",
        description:
          "Durante il tuo turno, ogni volta che un altro personaggio viene esiliato in una sfida, puoi preparare un personaggio Super a tua scelta. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
