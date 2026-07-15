import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rollerBobSidsToyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roller Bob",
    version: "Sid's Toy",
    text: [
      {
        title: "TIME TO MOVE",
        description:
          "When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Roller-Bob",
    version: "Sids Spielzeug",
    text: [
      {
        title: "Bewegung",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 2 Charakterkarten aus deinem Ablagestapel unter dein Deck legen, um diesem Charakter in diesem Zug <Rasant> zu geben.",
      },
    ],
  },
  fr: {
    name: "Roller Bob",
    version: "Jouet de Sid",
    text: [
      {
        title: "Il est temps de bouger",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer 2 cartes Personnage de votre défausse sous votre pioche pour donner <Charge> à ce personnage-ci pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ruota Libera",
    version: "Giocattolo di Sid",
    text: [
      {
        title: "È Ora di Muoversi",
        description:
          "Quando giochi questo personaggio, puoi mettere 2 carte personaggio dai tuoi scarti in fondo al tuo mazzo per dare a questo personaggio <Lesto> per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
