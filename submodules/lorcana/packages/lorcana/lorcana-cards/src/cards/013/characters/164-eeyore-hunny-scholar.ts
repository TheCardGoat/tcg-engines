import type { CharacterCard } from "@tcg/lorcana-types";
import { eeyoreHunnyScholarI18n } from "./164-eeyore-hunny-scholar.i18n";

export const eeyoreHunnyScholar: CharacterCard = {
  id: "AWz",
  canonicalId: "ci_AWz",
  slug: "lorcana-ci_AWz",
  printings: [
    {
      id: "set13-164",
      artId: "set13-164",
      setCode: "set13",
      collectorNumber: "164",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-164"],
  cardType: "character",
  name: "Eeyore",
  version: "Hunny Scholar",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 164,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2a13da4cb1ca43558f1781ec7613e1aa",
  },
  text: [
    {
      title: "HUNNYTACTICS",
      description:
        "Whenever this character quests, chosen Hunny character of yours gets +1 {L} and gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [
    {
      type: "triggered",
      name: "HUNNYTACTICS",
      text: "HUNNYTACTICS Whenever this character quests, chosen Hunny character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Hunny",
                },
              ],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Ward",
            duration: "until-start-of-next-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: eeyoreHunnyScholarI18n,
};
