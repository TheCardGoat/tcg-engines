import { installDecisionWorker } from "../../simulator/bot/decision-worker";
import { createAlphaClashBotPlanner } from "./bot-decision";
installDecisionWorker(createAlphaClashBotPlanner);
