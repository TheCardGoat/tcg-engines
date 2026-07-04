import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaFightingPrinceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Fighting Prince",
    text: [
      {
        title: "STEP DOWN OR FIGHT",
        description:
          "When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: • Draw 2 cards, then choose and discard 2 cards. • Deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Simba",
    version: "Kämpfender Prinz",
    text: [
      {
        title: "Dank ab oder kämpf",
        description:
          "Wenn du diesen Charakter ausspielst und jedes Mal, wenn er in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du eine Möglichkeit auswählen:",
      },
      {
        title: "• Ziehe 2 Karten. Wähle danach 2 Karten aus deiner Hand und wirf sie ab.",
      },
      {
        title: "• Füge einem Charakter deiner Wahl 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Simba",
    version: "Prince combattif",
    text: [
      {
        title: "Tu te soumets ou tu te bats",
        description:
          "Chaque fois que vous jouez ce personnage ou qu'il en bannit un autre via un défi durant votre tour, choisissez entre:",
      },
      {
        title: "• Piochez 2 cartes, puis choisissez et défaussez 2 cartes.",
      },
      {
        title: "• Choisissez un personnage et infligez-lui 2 dommages.",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Principe Combattente",
    text: [
      {
        title: "O ti Fai da Parte, o Dovrai Affrontarmi",
        description:
          "Quando giochi questo personaggio e ogni volta che esilia un altro personaggio in una sfida durante il tuo turno, scegli uno:",
      },
      {
        title: "• Pesca 2 carte, poi scegli e scarta 2 carte.",
      },
      {
        title: "• Infliggi 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
