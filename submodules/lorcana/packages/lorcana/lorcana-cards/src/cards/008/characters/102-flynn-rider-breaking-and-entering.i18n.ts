import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flynnRiderBreakingAndEnteringI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flynn Rider",
    version: "Breaking and Entering",
    text: [
      {
        title: "THIS IS",
        description:
          "A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Flynn Rider",
    version: "Einbrecher",
    text: [
      {
        title: "Heute ist ein ganz besonderer Tag",
        description:
          "Jedes Mal, wenn dieser Charakter herausgefordert wird, darf die herausfordernde Person 1 Karte aus ihrer Hand auswählen und abwerfen. Falls sie keine Karte abwirft, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Flynn Rider",
    version: "Entrant par effraction",
    text: [
      {
        title: "Aujourd'hui est un grand jour",
        description:
          "Chaque fois que ce personnage est défié, le joueur qui a lancé le défi peut défausser une carte. S'il ne le fait pas, vous gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Flynn Rider",
    version: "Entrato di Soppiatto",
    text: [
      {
        title: "Questo È Davvero un Grande Giorno",
        description:
          "Ogni volta che questo personaggio viene sfidato, il giocatore sfidante può scegliere e scartare una carta. Se non lo fa, ottieni 2 leggenda.",
      },
    ],
  },
};
