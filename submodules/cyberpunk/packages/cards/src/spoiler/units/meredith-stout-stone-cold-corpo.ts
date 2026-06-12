import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerMeredithStoutStoneColdCorpo = {
  id: "bd96d2fc-5c51-47a8-a428-09b13cfff35b",
  externalId: "cyberpunk:meredith-stout-stone-cold-corpo",
  slug: "meredith-stout-stone-cold-corpo",
  name: "Meredith Stout",
  subname: "Stone Cold Corpo",
  displayName: "Meredith Stout - Stone Cold Corpo",
  rulesText:
    "When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand.",
  flavorText: null,
  color: "red",
  classifications: ["Corpo", "Militech"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "069",
  printings: [
    {
      id: "0d09e470-1130-4ace-a5e7-7094ca9256f4",
      collectorNumber: "069",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b069.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b069.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "0d09e470-1130-4ace-a5e7-7094ca9256f4",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b069.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b069.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
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
  reminderText: [],
} satisfies SpoilerCardDefinition;
