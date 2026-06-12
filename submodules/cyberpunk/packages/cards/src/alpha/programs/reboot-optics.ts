import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaRebootOptics = {
  id: "cc85bde3-16d0-4064-b5f0-35dbd855bfed",
  externalId: "cyberpunk:reboot-optics",
  slug: "reboot-optics",
  name: "Reboot Optics",
  subname: null,
  displayName: "Reboot Optics",
  rulesText: "Give a friendly unit +4 power this turn. Defeat it at the end of the turn.",
  flavorText: null,
  color: "yellow",
  classifications: ["Tech"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α028",
  printings: [
    {
      id: "a8f8aa7b-4e5b-4f18-b6a2-d0e15f22f85f",
      collectorNumber: "α028",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a028.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a028.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Miguel Valderrama",
    },
  ],
  selectedPrintingId: "a8f8aa7b-4e5b-4f18-b6a2-d0e15f22f85f",
  artist: "Miguel Valderrama",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a028.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a028.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Give a friendly unit +4 power this turn. Defeat it at the end of the turn.")
      .onPlay()
      .source(target.self())
      .bind(
        "selectedUnit",
        target.card({
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          selection: {
            mode: "choose",
            min: 1,
            max: 1,
          },
        }),
      )
      .effect(
        effect.modifyPower({
          target: target.bound("selectedUnit"),
          value: 4,
          duration: "turn",
        }),
      )
      .effect(
        effect.delayed({
          timing: "endOfTurn",
          effects: [
            effect.defeat({
              target: target.bound("selectedUnit"),
            }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies AlphaCardDefinition;
