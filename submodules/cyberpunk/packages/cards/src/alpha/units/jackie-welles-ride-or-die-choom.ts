import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaJackieWellesRideOrDieChoom = {
  id: "2aa9e8cf-e425-4ebf-97dd-85a21f5b4424",
  externalId: "cyberpunk:jackie-welles-ride-or-die-choom",
  slug: "jackie-welles-ride-or-die-choom",
  name: "Jackie Welles",
  subname: "Ride Or Die Choom",
  displayName: "Jackie Welles - Ride Or Die Choom",
  rulesText:
    "This unit has +2 power for each of your friendly gigs. (Units steal an extra gig for every 10 power.)",
  flavorText: null,
  color: "yellow",
  classifications: ["Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α013",
  printings: [
    {
      id: "a9d250d6-bc4a-4d54-81e8-ea1ab6261d76",
      collectorNumber: "α013",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a013.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a013.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Ilya Kuvshinov",
    },
  ],
  selectedPrintingId: "a9d250d6-bc4a-4d54-81e8-ea1ab6261d76",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a013.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a013.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 6,
  power: 6,
  abilities: [
    AbilityBuilder.static()
      .text("This unit has +2 power for each of your friendly gigs.")
      .effect(
        effect.modifyPower({
          target: target.self(),
          value: {
            type: "perCount",
            multiplier: 2,
            target: target.gig({ controller: "friendly", amount: "all" }),
          },
          duration: "continuous",
        }),
      )
      .build(),
  ],
  reminderText: ["Units steal an extra gig for every 10 power."],
} satisfies AlphaCardDefinition;
