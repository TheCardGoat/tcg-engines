import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const philoctetesTrainerOfHeroesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Philoctetes",
    version: "Trainer of Heroes",
    text: "Support",
  },
  de: {
    name: "Phil",
    version: "Trainer der Helden",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "PHILOCTÈTE",
    version: "Entraineur de héros",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Philoctetes",
    version: "Trainer of Heroes",
    text: "<Support> (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  },
  es: {
    name: "Filoctetes",
    version: "Entrenador de héroes",
    text: "Apoyo",
  },
};
