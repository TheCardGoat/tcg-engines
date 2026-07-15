import type { CharacterCard } from "@tcg/lorcana-types";
import { ednaModeFashionDesignerI18n } from "./054-edna-mode-fashion-designer.i18n";

export const ednaModeFashionDesigner: CharacterCard = {
  id: "P5r",
  canonicalId: "ci_qC1",
  slug: "lorcana-ci_qC1",
  printings: [
    {
      id: "set12-054",
      artId: "set12-054",
      setCode: "set12",
      collectorNumber: "54",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set12-054"],
  cardType: "character",
  name: "Edna Mode",
  version: "Fashion Designer",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 54,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fb68c593a65344d5ad1585cb7a67777f",
    tcgPlayer: "692206",
  },
  text: [
    {
      title: "NO CAPES!",
      description:
        "When you play this character, you may return chosen item with cost 2 or less to its player's hand. If you do, its player draws a card.",
    },
    {
      title: "MAKING SUPERS FABULOUS",
      description: "Whenever this character quests, your Super characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "qC1-1",
      name: "NO CAPES!",
      type: "triggered",
      text: "NO CAPES! When you play this character, you may return chosen item with cost 2 or less to its player's hand. If you do, its player draws a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
                filters: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 2,
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "draw",
                amount: 1,
                target: "CARD_OWNER",
              },
            },
          ],
        },
      },
    },
    {
      id: "qC1-2",
      name: "MAKING SUPERS FABULOUS",
      type: "triggered",
      text: "MAKING SUPERS FABULOUS Whenever this character quests, your Super characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Super",
            },
          ],
        },
      },
    },
  ],
  i18n: ednaModeFashionDesignerI18n,
};
