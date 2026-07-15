import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theWitchWilyWoodcarverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Witch",
    version: "Wily Woodcarver",
    text: [
      {
        title: "UNSATISFIED CUSTOMERS",
        description: "Whenever this character is challenged, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Die Hexe",
    version: "Listige Holzschnitzerin",
    text: [
      {
        title: "Unzufriedene Auftraggeber",
        description:
          "Jedes Mal, wenn dieser Charakter herausgefordert wird, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "La Sorcière",
    version: "Sculptrice rusée",
    text: [
      {
        title: "Clients jamais satisfaits",
        description:
          "Chaque fois que ce personnage est défié, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "La Strega",
    version: "Furba Intagliatrice",
    text: [
      {
        title: "Clienti Insoddisfatti",
        description:
          "Ogni volta che questo personaggio viene sfidato, ogni avversario perde 1 leggenda.",
      },
    ],
  },
};
