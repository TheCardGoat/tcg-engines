import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theWallBorderFortressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Wall",
    version: "Border Fortress",
    text: [
      {
        title: "PROTECT THE REALM",
        description:
          "While you have an exerted character here, your other locations can't be challenged.",
      },
    ],
  },
  de: {
    name: "Die Mauer",
    version: "Grenzfestung",
    text: [
      {
        title: "DAS REICH SCHÜTZEN",
        description:
          "Solange du mindestens einen erschöpften Charakter an diesem Ort hast, können deine anderen Orte nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "La Muraille",
    version: "Fortification frontalière",
    text: [
      {
        title: "PROTÉGER LE ROYAUME",
        description:
          "Tant que vous avez un personnage épuisé sur ce lieu, vos autres lieux ne peuvent pas être défiés.",
      },
    ],
  },
  it: {
    name: "La Muraglia",
    version: "Fortezza di Confine",
    text: [
      {
        title: "PROTEGGERE IL REGNO",
        description:
          "Mentre hai un personaggio impegnato in questo luogo, i tuoi altri luoghi non possono essere sfidati.",
      },
    ],
  },
};
