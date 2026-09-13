import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dimenxxionalGateway } from "./dimenxxional-gateway.ts";

export const dimenxxionalGatewayI18n = defineFamilyI18n(dimenxxionalGateway, {
  en: {
    name: "Dimenxxional Gateway",
    text: (optCount) =>
      `Opt ${optCount}\nReveal the top card of your deck. If it's a Runeblade card, deal 1 arcane damage to each opposing hero. If it's a Shadow card, you may banish it.\nGo again`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: dimenxxionalGatewayRedI18n,
  yellow: dimenxxionalGatewayYellowI18n,
  blue: dimenxxionalGatewayBlueI18n,
} = dimenxxionalGatewayI18n.cards;
