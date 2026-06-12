import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const motherGothelKnowsWhatsBestEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother Gothel",
    version: "Knows What's Best",
    text: [
      {
        title: "LOOK WHAT YOU'VE DONE",
        description:
          'When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +1 {S} while challenging.)',
      },
    ],
  },
  de: {
    name: "Mutter Gothel",
    version: "Weiß, was das Beste ist",
    text: [
      {
        title: "SIEH NUR, WAS DU GETAN HAST",
        description:
          'Wenn du diesen Charakter ausspielst, darfst du einen deiner anderen Charaktere wählen und ihm 2 Schaden zufügen, um jenem in diesem Zug "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand" und Herausfordern +1 zu geben. (Während der Charakter herausfordert, erhält er +1.)',
      },
    ],
  },
  fr: {
    name: "Mère Gothel",
    version: "Qu’il faut écouter",
    text: [
      {
        title: "REGARDE CE QUE TU AS FAIT",
        description:
          'Lorsque vous jouez ce personnage, vous pouvez choisir un autre de vos personnages et lui infliger 2 dommages. Si vous le faites, le personnage choisi gagne Offensif +1 et "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main." pour le reste de ce tour.',
      },
    ],
  },
  it: {
    name: "Madre Gothel",
    version: "Che Sa Cosa È Meglio",
    text: [
      {
        title: "GUARDA COS'HAI FATTO",
        description:
          'Quando giochi questo personaggio, puoi infliggere 2 danni a un tuo altro personaggio a tua scelta per dare a quel personaggio Sfidante +1 e "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta" per questo turno.',
      },
    ],
  },
};
