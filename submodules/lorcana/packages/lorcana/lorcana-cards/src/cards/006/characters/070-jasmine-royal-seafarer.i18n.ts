import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jasmineRoyalSeafarerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jasmine",
    version: "Royal Seafarer",
    text: [
      {
        title: "BY ORDER OF THE PRINCESS",
        description: "When you play this character, choose one:",
      },
      {
        title: "* Exert chosen damaged character.",
      },
      {
        title:
          "* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Jasmin",
    version: "Königliche Seefahrerin",
    text: [
      {
        title: "Auf Befehl der Prinzessin",
        description: "Wenn du diesen Charakter ausspielst, wähle eine Möglichkeit aus:",
      },
      {
        title: "• Erschöpfe einen beschädigten Charakter deiner Wahl.",
      },
      {
        title:
          "• Ein gegnerischer Charakter deiner Wahl erhält in seinem nächsten Zug <Impulsiv>. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Jasmine",
    version: "Navigatrice royale",
    text: [
      {
        title: "Par ordre de la Princesse",
        description: "Lorsque vous jouez ce personnage, choisissez entre:",
      },
      {
        title: "• Choisissez un personnage ayant au moins 1 dommage et épuisez-le.",
      },
      {
        title:
          "• Choisissez un personnage adverse qui gagne <Combattant> durant son prochain tour. (Ce personnage ne peut pas être envoyé à l'aventure et doit défier s'il le peut.)",
      },
    ],
  },
  it: {
    name: "Jasmine",
    version: "Navigatrice Reale",
    text: [
      {
        title: "È La Principessa che ve lo Ordina",
        description: "Quando giochi questo personaggio, scegli uno:",
      },
      {
        title: "• Impegna un personaggio danneggiato a tua scelta.",
      },
      {
        title:
          "• Un personaggio avversario a tua scelta ottiene <Attaccabrighe> durante il suo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
};
