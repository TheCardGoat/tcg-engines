import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cinderellaBallroomSensationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cinderella",
    version: "Ballroom Sensation",
    text: "Singer 3",
  },
  de: {
    name: "Cinderella",
    version: "Sensation im Ballsaal",
    text: [
      {
        title: "Singen 3",
        description: "(Die Kosten dieses Charakters gelten als 3 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Cendrillon",
    version: "Fait sensation au bal",
    text: "Mélomane 3 (Ce personnage est considéré comme ayant un coût de 3 pour chanter des chansons.)",
  },
  it: {
    name: "Cinderella",
    version: "Ballroom Sensation",
    text: [
      {
        title: "Singer 3",
        description: "(This character counts as cost 3 to sing songs.)",
      },
    ],
  },
};
