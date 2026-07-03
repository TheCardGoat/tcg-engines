import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chichaDedicatedMotherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chicha",
    version: "Dedicated Mother",
    text: [
      {
        title: "Support",
      },
      {
        title: "ONE ON THE WAY",
        description:
          "During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Chicha",
    version: "Hingebungsvolle Mutter",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Eins unterwegs",
        description:
          "Jedes Mal, wenn du in deinem Zug 1 Karte in deinen Tintenvorrat legst, falls es die zweite Karte ist, die du in diesem Zug in deinen Tintenvorrat gelegt hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Chicha",
    version: "Maman dévouée",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Le bébé est en route",
        description:
          "Durant votre tour, lorsque vous placez une carte dans votre réserve d'encre, si c'est la deuxième ce tour-ci, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Chicha",
    version: "Madre Zelante",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Un Altro in Arrivo",
        description:
          "Durante il tuo turno, quando aggiungi una carta al tuo calamaio, se è la seconda carta che hai aggiunto al calamaio in questo turno, puoi pescare una carta.",
      },
    ],
  },
};
