import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerMeredithStoutStoneColdCorpo = defineCyberpunkCard({
  id: "bd96d2fc-5c51-47a8-a428-09b13cfff35b",
  slug: "meredith-stout-stone-cold-corpo",
  rulesText:
    "When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand.",
  subname: "Stone Cold Corpo",
  name: "Meredith Stout",
  displayName: "Meredith Stout - Stone Cold Corpo",
  canonicalId: "meredith-stout-stone-cold-corpo",
  color: "red",
  classifications: ["Corpo", "Militech"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "069",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/069.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigValueChanged",
          player: "rival",
          target: {
            selector: "gig",
            controller: "friendly",
          },
          direction: "decrease",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
          },
          destination: "hand",
          optional: true,
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
