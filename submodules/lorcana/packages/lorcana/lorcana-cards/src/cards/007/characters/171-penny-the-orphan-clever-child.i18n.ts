import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pennyTheOrphanCleverChildI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Penny the Orphan",
    version: "Clever Child",
    text: [
      {
        title: "OUR BOTTLE WORKED!",
        description: "While you have a Hero character in play, this character gains Ward.",
      },
    ],
  },
  de: {
    name: "Penny, das Waisenkind",
    version: "Kluges Kind",
    text: [
      {
        title: "DIE FLASCHE WAR KLASSE!",
        description:
          "Solange du mindestens einen Helden im Spiel hast, erhält dieser Charakter Behütet.",
      },
    ],
  },
  fr: {
    name: "Penny l'orpheline",
    version: "Enfant intelligente",
    text: [
      {
        title: "NOTRE BOUTEILLE A RÉUSSI!",
        description:
          "Tant que vous avez un personnage Héros en jeu, ce personnage-ci gagne Hors d'atteinte.",
      },
    ],
  },
  it: {
    name: "Penny l'Orfana",
    version: "Bambina Intelligente",
    text: [
      {
        title: "LA BOTTIGLIA HA FUNZIONATO!",
        description:
          "Mentre hai in gioco un personaggio Eroe, questo personaggio ottiene Protetto. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
