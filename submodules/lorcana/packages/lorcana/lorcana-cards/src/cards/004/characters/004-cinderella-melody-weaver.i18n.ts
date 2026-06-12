import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cinderellaMelodyWeaverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cinderella",
    version: "Melody Weaver",
    text: [
      {
        title: "Singer 9",
      },
      {
        title: "BEAUTIFUL VOICE",
        description:
          "Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Cinderella",
    version: "Melodien-Weberin",
    text: [
      {
        title: "Singen 9",
      },
      {
        title: "WUNDERSCHÖNE STIMME",
        description:
          "Jedes Mal, wenn dieser Charakter ein Lied singt, erhalten deine anderen Prinzessinnen in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Cendrillon",
    version: "Tisseuse de mélodies",
    text: [
      {
        title: "Mélomane 9",
      },
      {
        title: "VOIX MERVEILLEUSE",
        description:
          "Chaque fois que ce personnage chante une chanson, vos autres personnages Princesse gagnent +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cenerentola",
    version: "Tessitrice di Melodie",
    text: [
      {
        title: "Melodioso 9",
      },
      {
        title: "VOCE BELLISSIMA",
        description:
          "Ogni volta che questo personaggio canta una canzone, i tuoi altri personaggi Principessa ricevono +1 per questo turno.",
      },
    ],
  },
};
