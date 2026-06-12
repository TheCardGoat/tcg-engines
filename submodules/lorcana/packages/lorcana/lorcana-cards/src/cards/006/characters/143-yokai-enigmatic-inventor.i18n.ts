import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yokaiEnigmaticInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yokai",
    version: "Enigmatic Inventor",
    text: [
      {
        title: "TIME TO UPGRADE",
        description:
          "Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Yokai",
    version: "Rätselhafter Erfinder",
    text: [
      {
        title: "ZEIT FÜR EIN UPGRADE",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du 1 deiner Gegenstände zurück auf deine Hand nehmen. Wenn du dies tust, zahlst du 2 weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Yokai",
    version: "Inventeur énigmatique",
    text: [
      {
        title: "MISE À JOUR IMMÉDIATE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez renvoyer l'un de vos objets dans votre main. Si vous le faites, le prochain objet que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Yokai",
    version: "Inventore Enigmatico",
    text: [
      {
        title: "È ORA DI UN UPGRADE",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi riprendere in mano uno dei tuoi oggetti per pagare 2 in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
};
