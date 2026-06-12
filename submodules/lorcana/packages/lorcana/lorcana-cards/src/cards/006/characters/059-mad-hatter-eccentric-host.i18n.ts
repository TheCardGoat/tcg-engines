import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madHatterEccentricHostI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mad Hatter",
    version: "Eccentric Host",
    text: [
      {
        title: "WE'LL HAVE TO LOOK INTO THIS",
        description:
          "Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
      },
    ],
  },
  de: {
    name: "Der verrückte Hutmacher",
    version: "Exzentrischer Gastgeber",
    text: [
      {
        title: "JETZT SEHEN WIR MAL REIN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du dir die oberste Karte vom Deck einer ausgewählten mitspielenden Person ansehen. Lege die gewählte Karte als oberste Karte auf das zugehörige Deck oder den Ablagestapel.",
      },
    ],
  },
  fr: {
    name: "Le Chapelier Fou",
    version: "Hôte excentrique",
    text: [
      {
        title: "NOUS ALLONS ARRANGER ÇA",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un joueur et regarder la carte du dessus de sa pioche. Replacez-la sur sa pioche ou placez-la dans sa défausse.",
      },
    ],
  },
  it: {
    name: "Il Cappellaio Matto",
    version: "Ospite Eccentrico",
    text: [
      {
        title: "BISOGNA GUARDARE DENTRO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi guardare la prima carta del mazzo di un giocatore a tua scelta. Mettila in cima al suo mazzo, o nei suoi scarti.",
      },
    ],
  },
};
