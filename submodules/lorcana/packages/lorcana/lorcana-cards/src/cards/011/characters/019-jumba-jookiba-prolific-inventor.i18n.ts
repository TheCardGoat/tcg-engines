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
        title: "Einladende Menge",
        description:
          "Für jeden deiner Charaktere im Spiel zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Ich helfe",
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
        title: "Foule accueillante",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins pour chaque personnage que vous avez en jeu.",
      },
      {
        title: "J'apporte mon aide",
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
        title: "Gruppo Accogliente",
        description:
          "Per ogni personaggio che hai in gioco, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Sto Aiutando",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi rimuovere tutti i danni da un personaggio a tua scelta.",
      },
    ],
  },
};
