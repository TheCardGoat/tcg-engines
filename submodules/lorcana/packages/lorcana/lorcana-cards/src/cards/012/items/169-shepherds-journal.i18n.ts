import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shepherdsJournalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shepherd's Journal",
    text: [
      {
        title: "MARGIN NOTES",
        description:
          "When you play this item, you may look at the top card of your deck. Put it on either the top of your deck or into your discard.",
      },
      {
        title: "KEY TO THE PUZZLE 1",
        description:
          "{I}, Banish this item — Return another item card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Tagebuch des Hirten",
    text: [
      {
        title: "Randnotizen",
        description:
          "Wenn du diesen Gegenstand ausspielst, darfst du dir die oberste Karte deines Decks anschauen. Lege sie anschließend entweder auf dein Deck oder auf deinen Ablagestapel.",
      },
      {
        title: "Der Schlüssel zum Rätsel",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Nimm 1 andere Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Le Manuscrit du Berger",
    text: [
      {
        title: "Notes en marge",
        description:
          "Lorsque vous jouez cet objet, vous pouvez regarder la carte du dessus de votre pioche. Placez-la sur votre pioche ou dans votre défausse.",
      },
      {
        title: "La clé de l'énigme",
        description:
          "1 {I}, Bannissez cet objet — Renvoyez dans votre main une autre carte Objet de votre défausse.",
      },
    ],
  },
  it: {
    name: "Il Diario del Vecchio Pastore",
    text: [
      {
        title: "Note ai Margini",
        description:
          "Quando giochi questo oggetto, puoi guardare la prima carta del tuo mazzo. Mettila o in cima al tuo mazzo o nei tuoi scarti.",
      },
      {
        title: "La chiave dell'Enigma",
        description:
          "1 {I}, esilia questo oggetto — Riprendi in mano un'altra carta oggetto dai tuoi scarti.",
      },
    ],
  },
};
