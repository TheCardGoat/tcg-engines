import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fairyGodmothersWandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fairy Godmother's Wand",
    text: [
      {
        title: "ONLY TILL MIDNIGHT",
        description:
          "During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Zauberstab der guten Fee",
    text: [
      {
        title: "NUR BIS MITTERNACHT",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, wähle eine deiner Prinzessinnen. Sie erhält bis zu Beginn deines nächsten Zuges Behütet. (Gegnerische Mitspielende können die Prinzessin nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Baguette de la bonne fée",
    text: [
      {
        title: "DÈS QUE MINUIT SONNERA",
        description:
          "Durant votre tour, chaque fois que vous placez une carte dans votre réserve d'encre, choisissez l'un de vos personnages Princesse qui gagne Hors d'atteinte jusqu'au début de votre prochain tour. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Bacchetta della Fata Smemorina",
    text: [
      {
        title: "SOLO FINO A MEZZANOTTE",
        description:
          "Durante il tuo turno, ogni volta che aggiungi una carta al tuo calamaio, un tuo personaggio Principessa a tua scelta ottiene Protetto fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
