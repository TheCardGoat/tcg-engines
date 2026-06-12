import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const angelaNightWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Angela",
    version: "Night Warrior",
    text: [
      {
        title: "SHADOW POWER",
        description:
          "When you play this character, you may give chosen character Challenger +2 and Resist +2 until the start of your next turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
      },
      {
        title: "ETERNAL NIGHT",
        description: "Your Gargoyle characters lose the Stone by Day ability.",
      },
    ],
  },
  de: {
    name: "Angela",
    version: "Kriegerin der Nacht",
    text: [
      {
        title: "SCHATTENHAFTE MACHT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges Herausfordern +2 und Robust +2 geben. (Während der Charakter herausfordert, erhält er +2. Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
      },
      {
        title: "EWIGE NACHT",
        description: 'Deine Gargoyles verlieren ihre "Am Tage aus Stein"-Fähigkeit.',
      },
    ],
  },
  fr: {
    name: "Angela",
    version: "Guerrière de la nuit",
    text: [
      {
        title: "PUISSANCE DE L'OMBRE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage qui gagne Offensif +2 et Résistance +2 jusqu'au début de votre prochain tour. (Lorsqu'il défie, ce personnage gagne +2. Les dommages qui lui sont infligés sont réduits de 2.)",
      },
      {
        title: "NUIT ÉTERNELLE",
        description: "Vos personnages Gargouille perdent la capacité Statue le jour.",
      },
    ],
  },
  it: {
    name: "Angela",
    version: "Guerriera Notturna",
    text: [
      {
        title: "POTERE DELL'OMBRA",
        description:
          "Quando giochi questo personaggio, puoi dare Sfidante +2 e Resistere +2 a un personaggio a tua scelta fino all'inizio del tuo prossimo turno. (Riceve +2 mentre sta sfidando. Il danno che gli viene inflitto è ridotto di 2.)",
      },
      {
        title: "NOTTE ETERNA I",
        description: "tuoi personaggi Gargoyle perdono l'abilità Statue di Giorno.",
      },
    ],
  },
};
