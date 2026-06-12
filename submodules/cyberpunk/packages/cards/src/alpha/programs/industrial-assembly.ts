import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaIndustrialAssembly = {
  id: "48f31579-a32b-4c58-923c-93a2aa3b780c",
  externalId: "cyberpunk:industrial-assembly",
  slug: "industrial-assembly",
  name: "Industrial Assembly",
  subname: null,
  displayName: "Industrial Assembly",
  rulesText: "Increase a friendly gig by 4. Then, if you have 7+ Street Cred, draw a card.",
  flavorText: null,
  color: "red",
  classifications: ["Plan", "Arasaka"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α021",
  printings: [
    {
      id: "a190e602-4297-4b39-9641-6c991cce2204",
      collectorNumber: "α021",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a021.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a021.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Alexander Dudar",
    },
  ],
  selectedPrintingId: "a190e602-4297-4b39-9641-6c991cce2204",
  artist: "Alexander Dudar",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a021.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a021.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Increase a friendly gig by 4. Then, if you have 7+ Street Cred, draw a card.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.modifyGig({
          target: target.gig({
            controller: "friendly",
            selection: { mode: "choose", min: 1, max: 1 },
          }),
          operation: "increase",
          value: 4,
        }),
      )
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 7 }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies AlphaCardDefinition;
