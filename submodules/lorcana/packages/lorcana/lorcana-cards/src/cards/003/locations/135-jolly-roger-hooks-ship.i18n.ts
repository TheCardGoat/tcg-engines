import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jollyRogerHooksShipI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jolly Roger",
    version: "Hook's Ship",
    text: [
      {
        title: "LOOK ALIVE, YOU SWABS!",
        description:
          "Characters gain Rush while here. (They can challenge the turn they're played.)",
      },
      {
        title: "ALL HANDS ON DECK!",
        description: "Your Pirate characters may move here for free.",
      },
    ],
  },
  de: {
    name: "Die Jolly Roger",
    version: "Hooks Schiff",
    text: [
      {
        title: "VORWÄRTS, IHR LAPPEN!",
        description:
          "Charaktere an diesem Ort erhalten Rasant. (Die Charaktere können im selben Zug herausfordern, in dem sie ausgespielt werden.)",
      },
      {
        title: "ALLE AN DECK!",
        description: "Deine Piratinnen und Piraten können sich kostenlos zu diesem Ort bewegen.",
      },
    ],
  },
  fr: {
    name: "Jolly Roger",
    version: "Navire du Capitaine Crochet",
    text: [
      {
        title: "JE VEUX L'AVOIR MORT OU VIF!",
        description:
          "Les personnages sur ce lieu gagnent Charge. (Ces personnages peuvent défier le tour où ils sont joués.)",
      },
      {
        title: "TOUT LE MONDE À SON POSTE!",
        description: "Vos personnages Pirate peuvent être déplacés gratuitement sur ce lieu.",
      },
    ],
  },
  it: {
    name: "Jolly Roger",
    version: "Nave di Uncino",
    text: [
      {
        title: "ANIMO, MANIGOLDI!",
      },
      {
        title: "I",
        description:
          "personaggi ottengono Lesto mentre si trovano in questo luogo. (Possono sfidare nel turno in cui vengono giocati.)",
      },
      {
        title: "TUTTI IN COPERTA!",
      },
      {
        title: "I",
        description: "tuoi personaggi Pirata possono spostarsi in questo luogo gratis.",
      },
    ],
  },
};
