import { installDecisionWorker } from "../../simulator/bot/decision-worker";
import { decideOnePieceBot } from "./bot-decision";
installDecisionWorker((_: null) => decideOnePieceBot);
