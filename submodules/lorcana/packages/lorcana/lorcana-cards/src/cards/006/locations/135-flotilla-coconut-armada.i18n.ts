import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flotillaCoconutArmadaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flotilla",
    version: "Coconut Armada",
    text: [
      {
        title: "TINY THIEVES",
        description:
          "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
      },
    ],
  },
  de: {
    name: "Flottille",
    version: "Armada der Kokosnüsse",
    text: [
      {
        title: "KLEINE DIEBE",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Charakter an diesem Ort hast, verlieren alle gegnerischen Mitspielenden je 1 Legende und du sammelst für jede so verlorene Legende je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Flotille Kakamora",
    version: "Armada Noix de coco",
    text: [
      {
        title: "PETITS VOLEURS",
        description:
          "Au début de votre tour, si vous avez un personnage sur ce lieu, tous vos adversaires perdent 1 éclat de Lore. Gagnez autant d'éclats de Lore que vos adversaires en ont perdu de cette façon.",
      },
    ],
  },
  it: {
    name: "Flottiglia",
    version: "Flotta di Noci di Cocco",
    text: [
      {
        title: "MINUSCOLI LADRI",
        description:
          "All'inizio del tuo turno, se hai un personaggio in questo luogo, tutti gli avversari perdono 1 leggenda e tu ottieni leggenda pari alla leggenda persa in questo modo.",
      },
    ],
  },
};
