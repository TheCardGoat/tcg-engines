import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flotsamUrsulasBabyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flotsam",
    version: 'Ursula\'s "Baby"',
    text: [
      {
        title: "QUICK ESCAPE",
        description:
          "When this character is banished in a challenge, return this card to your hand.",
      },
      {
        title: "OMINOUS PAIR",
        description:
          'Your characters named Jetsam gain "When this character is banished in a challenge, return this card to your hand."',
      },
    ],
  },
  de: {
    name: "Abschaum",
    version: 'Ursulas "Baby"',
    text: [
      {
        title: "SCHNELLE FLUCHT",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand.",
      },
      {
        title: "UNHEIMLICHES DUO",
        description:
          'Deine Meerschaum-Charaktere erhalten "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand".',
      },
    ],
  },
  fr: {
    name: "Flotsam",
    version: '"Bébé" d\'Ursula',
    text: [
      {
        title: "FUITE RAPIDE",
        description: "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main.",
      },
      {
        title: "DUO INQUIÉTANT",
        description:
          'Vos personnages Jetsam gagnent "Lorsque ce personnage est banni via un défi, renvoyez cette carte dans votre main".',
      },
    ],
  },
  it: {
    name: "Flotsam",
    version: "“Piccino” di Ursula",
    text: [
      {
        title: "FUGA RAPIDA",
        description:
          "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
      {
        title: "COPPIA SINISTRA I",
        description:
          'tuoi personaggi chiamati Jetsam ottengono "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta."',
      },
    ],
  },
};
