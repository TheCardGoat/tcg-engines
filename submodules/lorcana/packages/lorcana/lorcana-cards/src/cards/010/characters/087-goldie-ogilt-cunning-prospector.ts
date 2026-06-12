import type { CharacterCard } from "@tcg/lorcana-types";
import { goldieOgiltCunningProspectorI18n } from "./087-goldie-ogilt-cunning-prospector.i18n";

export const goldieOgiltCunningProspector: CharacterCard = {
  id: "pYT",
  canonicalId: "ci_pYT",
  reprints: ["set10-087"],
  cardType: "character",
  name: "Goldie O'Gilt",
  version: "Cunning Prospector",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 87,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_eaa7f672c1fe4c099ec6fda242d6aa13",
    tcgPlayer: 658880,
  },
  text: [
    {
      title: "CLAIM JUMPER",
      description:
        "When you play this character, chosen opponent reveals their hand and discards a location card of your choice.",
    },
    {
      title: "STRIKE GOLD",
      description:
        "Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "pYT-1",
      name: "CLAIM JUMPER",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              cardType: "location",
            },
          },
        ],
      },
      text: "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.",
    },
    {
      id: "pYT-2",
      name: "STRIKE GOLD",
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
              type: "put-on-bottom",
              target: {
                selector: "chosen",
                count: {
                  exactly: 1,
                },
                owner: "any",
                zones: ["discard"],
                cardTypes: ["location"],
              },
            },
            {
              type: "for-each",
              counter: {
                type: "last-effect-target-count",
              },
              effect: {
                type: "gain-lore",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
      text: "STRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
    },
  ],
  i18n: goldieOgiltCunningProspectorI18n,
};
