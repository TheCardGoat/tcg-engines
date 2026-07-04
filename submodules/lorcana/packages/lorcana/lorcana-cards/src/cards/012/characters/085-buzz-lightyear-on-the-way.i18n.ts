import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const buzzLightyearOnTheWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Buzz Lightyear",
    version: "On the Way",
    text: [
      {
        title: "SECRET MISSION",
        description:
          "Whenever you pay 2 {I} or less to play a non-character, draw a card, then choose and discard a card.",
      },
      {
        title: "WORLD'S GREATEST TOY",
        description:
          "Whenever you pay 2 {I} or less to play a character, deal 1 damage to chosen opposing damaged character.",
      },
    ],
  },
  de: {
    name: "Buzz Lightyear",
    version: "Schon unterwegs",
    text: [
      {
        title: "Geheime Mission",
        description:
          "Jedes Mal, wenn du 2 oder weniger {I} bezahlst, um eine Karte auszuspielen, die kein Charakter ist, ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "Das tollste Spielzeug der Welt",
        description:
          "Jedes Mal, wenn du 2 oder weniger {I} bezahlst, um einen Charakter auszuspielen, füge einem gegnerischen beschädigten Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Buzz l'Éclair",
    version: "J'arrive",
    text: [
      {
        title: "Mission secrète",
        description:
          "Chaque fois que vous payez 2 {I} ou moins pour jouer une carte non-Personnage, piochez une carte puis défaussez une carte.",
      },
      {
        title: "Super jouet universel",
        description:
          "Chaque fois que vous payez 2 {I} ou moins pour jouer un personnage, choisissez un personnage adverse ayant au moins un dommage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Buzz Lightyear",
    version: "In Arrivo",
    text: [
      {
        title: "Missione Segreta",
        description:
          "Ogni volta che paghi 2 {I} o meno per giocare una carta non personaggio, pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "Il Più Bel Giocattolo del Mondo",
        description:
          "Ogni volta che paghi 2 {I} o meno per giocare un personaggio, infliggi 1 danno a un personaggio avversario danneggiato a tua scelta.",
      },
    ],
  },
};
