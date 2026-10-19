import { installDecisionWorker } from "../../../../../simulator/bot/decision-worker";
import { createGundamBotPlanner } from "./bot-decision";
installDecisionWorker(createGundamBotPlanner);
