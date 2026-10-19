import { installDecisionWorker } from "../../simulator/bot/decision-worker";
import {
  decideGrandArchiveBot,
  type GrandArchiveBotInput,
  type GrandArchiveBotContext,
} from "./bot-decision";
installDecisionWorker(
  (program: GrandArchiveBotContext) => (input: GrandArchiveBotInput) =>
    decideGrandArchiveBot(input, program),
);
