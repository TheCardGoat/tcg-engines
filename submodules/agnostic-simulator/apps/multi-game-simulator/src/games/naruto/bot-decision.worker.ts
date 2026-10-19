import { installDecisionWorker } from "../../simulator/bot/decision-worker";
import { decideNarutoBot } from "./bot-decision";
installDecisionWorker((_: null) => decideNarutoBot);
