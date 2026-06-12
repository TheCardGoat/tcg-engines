import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainAmeliaCommanderOfTheLegacyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Amelia",
    version: "Commander of the Legacy",
    text: [
      {
        title: "DRIVELING GALOOTS",
        description: "This character can't be challenged by Pirate characters.",
      },
      {
        title: "EVERYTHING SHIPSHAPE",
        description: "While being challenged, your other characters gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Käpt'n Amelia",
    version: "Kommandantin der Legacy",
    text: [
      {
        title: "EIN JÄMMERLICHER HAUFEN",
        description: "Dieser Charakter kann nicht von Piraten herausgefordert werden.",
      },
      {
        title: "ALLES TIPPTOPP",
        description:
          "Deine anderen Charaktere erhalten Robust +1, während sie herausgefordert werden. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Capitaine Amélia",
    version: "Commandante du RLS Héritage",
    text: [
      {
        title: "DEMEURÉS RADOTEURS",
        description: "Ce personnage ne peut pas être défié par un personnage Pirate.",
      },
      {
        title: "ET LE BATEAU, ÇA BAIGNE?",
        description: "Vos autres personnages gagnent Résistance +1 tant qu'ils sont défiés.",
      },
    ],
  },
  it: {
    name: "Capitano Amelia",
    version: "Comandante della Legacy",
    text: [
      {
        title: "CANAGLIUME VARIO",
        description: "Questo personaggio non può essere sfidato da personaggi Pirata.",
      },
      {
        title: "TUTTO A POSTO",
        description: "Mentre vengono sfidati, i tuoi altri personaggi ottengono Resistere +1.",
      },
    ],
  },
};
