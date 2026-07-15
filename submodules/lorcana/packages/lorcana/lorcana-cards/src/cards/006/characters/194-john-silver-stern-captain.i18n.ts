import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverSternCaptainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Stern Captain",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Resist +2",
      },
      {
        title: "DON'T JUST SIT THERE!",
        description: "At the start of your turn, deal 1 damage to each opposing ready character.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Strenger Kapitän",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner John-Silver-Charaktere auszuspielen.)",
      },
      {
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "Sitz nicht einfach herum!",
        description:
          "Zu Beginn deines Zuges, füge jedem gegnerischen bereiten Charakter 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Capitaine sévère",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages John Silver.)",
      },
      {
        title: "<Résistance> +2",
      },
      {
        title: "Ne reste pas planté là!",
        description:
          "Au début de votre tour, infligez 1 dommage à chaque personnage adverse redressé.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Capitano Severo",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato John Silver.)",
      },
      {
        title: "<Resistere> +2",
      },
      {
        title: "Non Startene Lì Impalato!",
        description:
          "All'inizio del tuo turno, infliggi 1 danno a ogni personaggio avversario preparato.",
      },
    ],
  },
};
