import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marshmallowCrankyClimberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Marshmallow",
    version: "Cranky Climber",
    text: [
      {
        title: "ICY BLAST",
        description:
          "Whenever this character quests, each opponent can't ready more than 1 of their characters at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Marshmallow",
    version: "Griesgrämiger Kletterer",
    text: [
      {
        title: "EISIGE EXPLOSION",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, können alle gegnerischen Mitspielenden zu Beginn ihres nächsten Zuges nur 1 ihrer Charaktere bereit machen.",
      },
    ],
  },
  fr: {
    name: "Guimauve",
    version: "Grimpeur irritable",
    text: [
      {
        title: "SOUFFLE GLACÉ",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, aucun adversaire ne peut redresser plus de 1 personnage au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Marshmallow",
    version: "Arrampicatore Irascibile",
    text: [
      {
        title: "COLPO GHIACCIATO",
        description:
          "Ogni volta che questo personaggio va all'avventura, ogni avversario non può preparare più di 1 dei suoi personaggi all'inizio del suo prossimo turno.",
      },
    ],
  },
};
