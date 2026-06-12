import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesLookingForADealI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "Looking for a Deal",
    text: [
      {
        title: "WHAT D'YA SAY?",
        description:
          "When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "Möchte ein Geschäft abschließen",
    text: [
      {
        title: "NA, WAS SAGST DU?",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen gegnerischen Charakter wählen. Wenn du dies tust, ziehe 2 Karten, außer die Person, die den gewählten Charakter im Spiel hat, legt ihn unter ihr Deck.",
      },
    ],
  },
  fr: {
    name: "Hadès",
    version: "Cherchant un accord",
    text: [
      {
        title: "ON S'LA SERRE?",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage adverse. Si vous le faites, piochez 2 cartes sauf si son propriétaire place cette carte sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "In Cerca di un Affare",
    text: [
      {
        title: "UNA STRETTA DI MANO?",
        description:
          "Quando giochi questo personaggio, puoi scegliere un personaggio avversario. Se lo fai, pesca 2 carte a meno che il giocatore di quel personaggio non metta quella carta in fondo al suo mazzo.",
      },
    ],
  },
};
