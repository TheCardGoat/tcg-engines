import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jumbaJookibaProlificInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jumba Jookiba",
    version: "Prolific Inventor",
    text: [
      {
        title: "WELCOMING CROWD",
        description:
          "For each character you have in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "I AM HELPING",
        description:
          "Whenever this character quests, you may remove all damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Jamba Jookiba",
    version: "Erfolgreicher Erfinder",
    text: [
      {
        title: "EINLADENDE MENGE",
        description:
          "Für jeden deiner Charaktere im Spiel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "ICH HELFE",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du jeglichen Schaden von einem Charakter deiner Wahl entfernen.",
      },
    ],
  },
  fr: {
    name: "Jumba Jookiba",
    version: "Inventeur prolifique",
    text: [
      {
        title: "FOULE ACCUEILLANTE",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque personnage que vous avez en jeu.",
      },
      {
        title: "J'APPORTE MON AIDE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage et lui retirer tous ses dommages.",
      },
    ],
  },
  it: {
    name: "Jumba Jookiba",
    version: "Inventore Prolifico",
    text: [
      {
        title: "GRUPPO ACCOGLIENTE",
        description:
          "Per ogni personaggio che hai in gioco, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "STO AIUTANDO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi rimuovere tutti i danni da un personaggio a tua scelta.",
      },
    ],
  },
};
