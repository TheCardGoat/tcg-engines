import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelEscapingTheTowerI18n } from "./095-rapunzel-escaping-the-tower.i18n";

export const rapunzelEscapingTheTower: CharacterCard = {
  id: "zg8",
  canonicalId: "ci_zg8",
  slug: "lorcana-ci_zg8",
  printings: [
    {
      id: "set13-095",
      artId: "set13-095",
      setCode: "set13",
      collectorNumber: "95",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-095"],
  cardType: "character",
  name: "Rapunzel",
  version: "Escaping the Tower",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 95,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6afa057b946845d1b46725c7603c50bf",
  },
  text: [
    {
      title: "THE CALL OF ADVENTURE",
      description:
        "Once during your turn, you may discard a card to give this character +1 {L} and Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "zg8-1",
      name: "THE CALL OF ADVENTURE",
      type: "activated",
      text: "THE CALL OF ADVENTURE Once during your turn, you may discard a card to give this character +1 {L} and Evasive until the start of your next turn.",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      restrictions: [
        {
          type: "once-per-turn",
        },
      ],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            duration: "until-start-of-next-turn",
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: "SELF",
          },
        ],
      },
    },
  ],
  i18n: rapunzelEscapingTheTowerI18n,
};
