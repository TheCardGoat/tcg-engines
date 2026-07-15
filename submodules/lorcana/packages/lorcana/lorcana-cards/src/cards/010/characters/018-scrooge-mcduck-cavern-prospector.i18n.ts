import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckCavernProspectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Cavern Prospector",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "SPECULATION",
        description:
          "Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Höhlenforscher",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Dagobert-Duck-Charaktere auszuspielen.)",
      },
      {
        title: "Spekulationen",
        description:
          "Jedes Mal, wenn du einen Charakter oder Ort mit <Stärken> ausspielst, darfst du die oberste Karte deines Decks verdeckt unter jenen legen.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Prospecteur de cavernes",
    text: [
      {
        title:
          "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages nommé Balthazar Picsou.)",
      },
      {
        title: "Spéculation",
        description:
          "Chaque fois que vous jouez un personnage ou un lieu ayant <Boost>, vous pouvez placer la carte du dessus de votre pioche sous la carte jouée, face cachée.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Cercatore di Caverne",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Paperon de' Paperoni.)",
      },
      {
        title: "Speculazione",
        description:
          "Ogni volta che giochi un personaggio o un luogo con <Potenziamento>, puoi mettere la prima carta del tuo mazzo a faccia in giù sotto di esso.",
      },
    ],
  },
};
