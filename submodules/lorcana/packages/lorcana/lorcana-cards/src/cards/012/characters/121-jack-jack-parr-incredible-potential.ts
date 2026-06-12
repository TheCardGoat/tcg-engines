import type { CharacterCard } from "@tcg/lorcana-types";
import { jackjackParrIncrediblePotentialI18n } from "./121-jack-jack-parr-incredible-potential.i18n";

export const jackjackParrIncrediblePotential: CharacterCard = {
  id: "rvl",
  canonicalId: "ci_rvl",
  reprints: ["set12-121"],
  cardType: "character",
  name: "Jack-Jack Parr",
  version: "Incredible Potential",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 121,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_519eea38258c49ca9b1eab9981d74544",
  },
  text: [
    {
      title: "WEIRD THINGS ARE HAPPENING",
      description:
        "At the start of your turn, you may put the top card of your deck into your discard.",
    },
    {
      title: "If its card type is:",
    },
    {
      title: "• character, this character gets +2 {S} this turn.",
    },
    {
      title: "• action or item, this character gets +2 {L} this turn.",
    },
    {
      title: "• location, banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "rvl-1",
      name: "WEIRD THINGS ARE HAPPENING",
      type: "triggered",
      text: "WEIRD THINGS ARE HAPPENING At the start of your turn, you may put the top card of your deck into your discard. If its card type is: • character, this character gets +2 {S} this turn. • action or item, this character gets +2 {L} this turn. • location, banish chosen character.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "reveal-and-route",
          target: "CONTROLLER",
          routes: [
            {
              condition: { type: "revealed-is-card-type", cardType: "character" },
              destination: { zone: "discard" },
              sideEffects: [
                {
                  type: "modify-stat",
                  stat: "strength",
                  modifier: 2,
                  duration: "this-turn",
                  target: "SELF",
                },
              ],
            },
            {
              condition: { type: "revealed-is-card-type", cardType: ["action", "item"] },
              destination: { zone: "discard" },
              sideEffects: [
                {
                  type: "modify-stat",
                  stat: "lore",
                  modifier: 2,
                  duration: "this-turn",
                  target: "SELF",
                },
              ],
            },
            {
              condition: { type: "revealed-is-card-type", cardType: "location" },
              destination: { zone: "discard" },
              sideEffects: [
                {
                  type: "banish",
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "any",
                    zones: ["play"],
                    cardTypes: ["character"],
                  },
                },
              ],
            },
          ],
          fallback: { zone: "discard" },
        },
      },
    },
  ],
  i18n: jackjackParrIncrediblePotentialI18n,
};
