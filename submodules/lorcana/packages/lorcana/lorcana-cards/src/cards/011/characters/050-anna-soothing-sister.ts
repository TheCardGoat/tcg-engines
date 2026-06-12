import type { CharacterCard } from "@tcg/lorcana-types";
import { annaSoothingSisterI18n } from "./050-anna-soothing-sister.i18n";

export const annaSoothingSister: CharacterCard = {
  id: "5xM",
  canonicalId: "ci_SGl",
  reprints: ["set11-050"],
  cardType: "character",
  name: "Anna",
  version: "Soothing Sister",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 50,
  rarity: "legendary",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_862f8b58a6e247cd865509856286449e",
    tcgPlayer: 677160,
  },
  text: [
    {
      title: "UNUSUAL TRANSFORMATION",
      description: "If a card left a player's discard this turn, this card gains Shift 0 {I}.",
    },
    {
      title: "WARM HEART",
      description:
        "Whenever this character quests, you may gain lore equal to the {L} of a character card in your discard. If you do, put that card on the bottom of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen"],
  abilities: [
    {
      id: "uqc-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 0,
      },
      shiftTarget: "Anna",
      condition: {
        type: "turn-metric",
        metric: "discard-cards-left",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      text: "UNUSUAL TRANSFORMATION If a card left a player's discard this turn, this card gains Shift 0 {I}.",
    },
    {
      id: "uqc-2",
      name: "WARM HEART",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["discard"],
                cardTypes: ["character"],
              },
            },
            {
              type: "gain-lore",
              amount: {
                type: "lore-value-of",
                target: { ref: "previous-target" },
              },
              target: "CONTROLLER",
            },
            {
              type: "put-on-bottom",
              target: { ref: "previous-target" },
            },
          ],
        },
      },
      text: "WARM HEART Whenever this character quests, you may gain lore equal to the {L} of a character card in your discard. If you do, put that card on the bottom of your deck.",
    },
  ],
  i18n: annaSoothingSisterI18n,
};
