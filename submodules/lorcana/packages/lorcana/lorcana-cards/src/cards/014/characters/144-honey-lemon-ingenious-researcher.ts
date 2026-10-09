import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities";
import { honeyLemonIngeniousResearcherI18n } from "./144-honey-lemon-ingenious-researcher.i18n";

export const honeyLemonIngeniousResearcher: CharacterCard = {
  id: "ATK",
  canonicalId: "ci_ATK",
  slug: "lorcana-ci_ATK",
  printings: [
    {
      id: "set14-144",
      artId: "set14-144",
      setCode: "set14",
      collectorNumber: "144",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-144"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Ingenious Researcher",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Synthesize",
      description:
        "Whenever this character quests, you may return an item card from your discard to your hand. If you do, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Inventor"],
  abilities: [
    shift(5),
    {
      id: "honey-lemon-researcher-1",
      name: "Synthesize",
      type: "triggered",
      text: "Synthesize Whenever this character quests, you may return an item card from your discard to your hand. If you do, get 1 ink drop.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "return-from-discard",
              cardType: "item",
              count: 1,
              target: "CONTROLLER",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "gain-ink-drop",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
    },
  ],
  i18n: honeyLemonIngeniousResearcherI18n,
};
