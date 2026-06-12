import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarFinallyKingI18n: Record<Languages, I18nProperties> = {
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
        title: "SEID DANKBAR",
        description: "Deine Verbündeten erhalten +1.",
      },
      {
        title: "HALTET ZU MIR",
        description:
          "Am Ende deines Zuges, wenn dieser Charakter erschöpft ist, darfst du einen deiner Verbündeten wählen und so viele Karten ziehen, wie dieser hat. Wenn du dies tust, wähle 2 Karten aus deiner Hand und wirf sie ab und verbanne den gewählten Charakter.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Enfin roi",
    text: [
      {
        title: "SOYEZ RECONNAISSANTES",
        description: "Vos personnages Allié gagnent +1.",
      },
      {
        title: "SUIVEZ-MOI À",
        description:
          "la fin de votre tour, si ce personnage est épuisé, vous pouvez choisir l'un de vos personnages Allié et piocher autant de cartes que sa. Si vous le faites, défaussez 2 cartes et bannissez le personnage choisi de cette façon.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Finalmente Re",
    text: [
      {
        title: "SIATE GRATI I",
        description: "tuoi personaggi Alleato ricevono +1.",
      },
      {
        title: "SEGUITEMI",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, puoi pescare carte pari alla di un tuo personaggio Alleato a tua scelta. Se lo fai, scegli e scarta 2 carte ed esilia quel personaggio.",
      },
    ],
  },
};
