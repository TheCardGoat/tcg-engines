import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cursedMerfolkUrsulasHandiworkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cursed Merfolk",
    version: "Ursula's Handiwork",
    text: [
      {
        title: "POOR SOULS",
        description:
          "Whenever this character is challenged, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Verfluchte Meerleute",
    version: "Ursulas Handwerkskunst",
    text: [
      {
        title: "ARME SEELEN",
        description:
          "Jedes Mal, wenn dieser Charakter herausgefordert wird, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Ondins ensorcelés",
    version: "Œuvre d'Ursula",
    text: [
      {
        title: "PAUVRES ÂMES",
        description:
          "Chaque fois que ce personnage est défié, chaque adversaire choisit une carte et la défausse.",
      },
    ],
  },
  it: {
    name: "Sventurata Gente del Mare",
    version: "Opera di Ursula",
    text: [
      {
        title: "POVERE ANIME",
        description:
          "Ogni volta che questo personaggio viene sfidato, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
