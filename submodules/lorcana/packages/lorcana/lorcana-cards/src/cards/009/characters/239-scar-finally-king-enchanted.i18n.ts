import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarFinallyKingEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Finally King",
    text: [
      {
        title: "BE GRATEFUL",
        description: "Your Ally characters get +1 {S}.",
      },
      {
        title: "STICK WITH ME",
        description:
          "At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Endlich König",
    text: [
      {
        title: "Seid dankbar",
        description: "Deine Verbündeten erhalten +1 {S}.",
      },
      {
        title: "Haltet zu mir",
        description:
          "Am Ende deines Zuges, wenn dieser Charakter erschöpft ist, darfst du einen deiner Verbündeten wählen und so viele Karten ziehen, wie dieser {S} hat. Wenn du dies tust, wähle 2 Karten aus deiner Hand und wirf sie ab und verbanne den gewählten Charakter.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Enfin roi",
    text: [
      {
        title: "Soyez reconnaissantes",
        description: "Vos personnages Allié gagnent +1 {S}.",
      },
      {
        title: "Suivez-moi",
        description:
          "À la fin de votre tour, si ce personnage est épuisé, vous pouvez choisir l'un de vos personnages Allié et piocher autant de cartes que sa {S}. Si vous le faites, défaussez 2 cartes et bannissez le personnage choisi de cette façon.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Finalmente Re",
    text: [
      {
        title: "Siate Grati",
        description: "I tuoi personaggi Alleato ricevono +1 {S}.",
      },
      {
        title: "Seguitemi",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, puoi pescare carte pari alla {S} di un tuo personaggio Alleato a tua scelta. Se lo fai, scegli e scarta 2 carte ed esilia quel personaggio.",
      },
    ],
  },
};
