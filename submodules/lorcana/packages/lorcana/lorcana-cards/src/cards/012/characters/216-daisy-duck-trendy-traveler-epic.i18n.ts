import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckTrendyTravelerEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Trendy Traveler",
    text: [
      {
        title: "BREAK IS OVER",
        description:
          "Whenever this character quests, if you played a character this turn, you may ready another chosen character. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Modebewusste Reisende",
    text: [
      {
        title: "Die Pause ist vorbei",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du in diesem Zug mindestens einen Charakter ausgespielt hast, darfst du einen anderen Charakter deiner Wahl bereit machen. Wenn du dies tust, kann er in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Voyageuse tendance",
    text: [
      {
        title: "La pause est terminée",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez joué un personnage ce tour-ci, vous pouvez choisir un autre personnage et le redresser. Si vous le faites, ce personnage-là ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperina",
    version: "Viaggiatrice alla Moda",
    text: [
      {
        title: "La Pausa è Finita",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai giocato un personaggio in questo turno, puoi preparare un altro personaggio a tua scelta. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
