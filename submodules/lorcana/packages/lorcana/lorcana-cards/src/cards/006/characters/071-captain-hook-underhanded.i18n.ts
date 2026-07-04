import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookUnderhandedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook",
    version: "Underhanded",
    text: [
      {
        title: "INSPIRES DREAD",
        description: "While this character is exerted, opposing Pirate characters can't quest.",
      },
      {
        title: "UPPER HAND",
        description: "Whenever this character is challenged, draw a card.",
      },
    ],
  },
  de: {
    name: "Käpt'n Hook",
    version: "Heimtückisch",
    text: [
      {
        title: "Angsteinflößend",
        description:
          "Solange dieser Charakter erschöpft ist, können gegnerische Piraten nicht erkunden.",
      },
      {
        title: "Oberhand",
        description: "Jedes Mal, wenn dieser Charakter herausgefordert wird, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Capitaine Crochet",
    version: "En sous-main",
    text: [
      {
        title: "Inspirer la crainte",
        description:
          "Tant que ce personnage est épuisé, les personnages Pirate adverses ne peuvent pas être envoyés à l'aventure.",
      },
      {
        title: "Mainmise",
        description: "Chaque fois que ce personnage est défié, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Capitan Uncino",
    version: "Subdolo",
    text: [
      {
        title: "Suscitare Terrore",
        description:
          "Mentre questo personaggio è impegnato, i personaggi Pirata avversari non possono andare all'avventura.",
      },
      {
        title: "Vantaggio",
        description: "Ogni volta che questo personaggio viene sfidato, pesca una carta.",
      },
    ],
  },
};
