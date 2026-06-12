import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaSeaWitchQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Sea Witch Queen",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "NOW I AM THE RULER!",
        description: "Whenever this character quests, exert chosen character.",
      },
      {
        title: "YOU'LL LISTEN TO ME!",
        description: "Other characters can't exert to sing songs.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Seehexen-Königin",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "JETZT BIN ICH DIE HERRSCHERIN!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erschöpfe einen Charakter deiner Wahl.",
      },
      {
        title: "HÖRT MIR ZU!",
        description: "Andere Charaktere können nicht erschöpft werden um Lieder zu singen.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Reine-Sorcière des mers",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "JE SUIS LA SOUVERAINE!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage et épuisez-le.",
      },
      {
        title: "VOUS M'ÉCOUTEREZ!",
        description:
          "Les autres personnages ne peuvent pas être épuisés pour chanter des chansons.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Strega del Mare Regina",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "ORA COMANDO IO!",
        description:
          "Ogni volta che questo personaggio va all'avventura, impegna un personaggio a tua scelta.",
      },
      {
        title: "ASCOLTAMI BENE!",
        description: "Gli altri personaggi non si possono impegnare per cantare canzoni.",
      },
    ],
  },
};
