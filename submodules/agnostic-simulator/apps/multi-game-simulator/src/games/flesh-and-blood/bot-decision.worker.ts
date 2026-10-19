import { installDecisionWorker } from "../../simulator/bot/decision-worker";
import { decideFabBot, type FabBotInput, type FabBotContext } from "./bot-decision";
installDecisionWorker(
  (context: FabBotContext) => (input: FabBotInput) => decideFabBot(input, context),
);
