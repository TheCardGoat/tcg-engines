import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const forestDuelI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Forest Duel",
    text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)',
  },
  de: {
    name: "Duell im Wald",
    text: 'Deine Charaktere erhalten in diesem Zug: "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand" und Herausfordern +2. (Während die Charaktere herausfordern, erhalten sie +2.)',
  },
  fr: {
    name: "Duel en Forêt",
    text: 'Vos personnages gagnent Offensif +2 et "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main." pour le reste de ce tour. (Lorsqu\'ils défient, ces personnages gagnent +2.)',
  },
  it: {
    name: "Duello nella Foresta",
    text: [
      {
        title: "I",
        description:
          'tuoi personaggi ottengono Sfidante +2 e "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta" per questo turno. (Ricevono +2 mentre stanno sfidando.)',
      },
    ],
  },
};
