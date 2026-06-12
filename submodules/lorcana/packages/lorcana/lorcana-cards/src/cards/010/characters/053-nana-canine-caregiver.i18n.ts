import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nanaCanineCaregiverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nana",
    version: "Canine Caregiver",
    text: [
      {
        title: "HELPFUL INSTINCTS",
        description:
          "When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Nana",
    version: "Betreuungshündin",
    text: [
      {
        title: "HILFREICHE INSTINKTE",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Karte von deiner Hand auswählen und abwerfen, um einen Charakter deiner Wahl, der 2 oder weniger kostet, auf die zugehörige Hand zurückzuschicken.",
      },
    ],
  },
  fr: {
    name: "Nana",
    version: "Nourrice canine",
    text: [
      {
        title: "INSTINCTS DE SECOURS",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser une carte pour choisir un personnage coûtant 2 ou moins et le renvoyer dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Nana",
    version: "Balia Canina",
    text: [
      {
        title: "ISTINTI COLLABORATIVI",
        description:
          "Quando giochi questo personaggio, puoi scegliere e scartare una carta per far riprendere in mano al suo giocatore un personaggio a tua scelta con costo 2 o inferiore.",
      },
    ],
  },
};
