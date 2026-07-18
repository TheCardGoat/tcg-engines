import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bellwetherAssistantMayorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bellwether",
    version: "Assistant Mayor",
    text: [
      {
        title: "FEAR ALWAYS WORKS",
        description:
          "During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Bellwether",
    version: "Stellvertretende Bürgermeisterin",
    text: [
      {
        title: "Angst funktioniert immer",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält ein gegnerischer Charakter deiner Wahl in seinem nächsten Zug <Impulsiv>. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Bellwether",
    version: "Adjointe au maire",
    text: [
      {
        title: "La peur, ça marche toujours",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage adverse qui gagne <Combattant> durant son prochain tour.",
      },
    ],
  },
  it: {
    name: "Bellwether",
    version: "Assistente Sindaco",
    text: [
      {
        title: "La Paura Funziona Sempre",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio avversario a tua scelta ottiene <Attaccabrighe> durante il suo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
  es: {
    name: "Manso",
    version: "Asistente de alcalde",
    text: [
      {
        title: "EL MIEDO SIEMPRE FUNCIONA",
        description:
          "Durante tu turno, cada vez que se pone una carta en tu tintero, el personaje contrario elegido gana Temerario durante su siguiente turno. (No pueden realizar misiones y deben desafiar si pueden).",
      },
    ],
  },
};
