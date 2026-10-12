import type { EngineInteractionView } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import type { AcSeat, LiveBoardState } from "../board-types";
import type { ArenaTurnConsoleAction, ArenaTurnPhase } from "./ArenaTurnConsole";

const clashSteps: Readonly<Record<string, string>> = {
  attack: "Attack",
  counter: "Counter attack",
  obstruct: "Obstruction",
  attackerBuff: "Attacker buff",
  defenderBuff: "Defender buff",
  beforeDamage: "Before damage",
  damage: "Damage",
};

/** Native projection supplies timing; advertised actions supply who can act. */
export function nativeTurnConsole(
  board: LiveBoardState,
  view: EngineInteractionView,
  viewerSeat: AcSeat,
) {
  let phase: ArenaTurnPhase;
  switch (board.phaseName) {
    case "startOfTurn":
      phase = "start";
      break;
    case "expansion":
      phase = "expansion";
      break;
    case "primary":
      phase = "primary";
      break;
    case "clash":
      phase = "clash";
      break;
    case "endOfTurn":
      phase = "end";
      break;
    default:
      return null;
  }
  const response = Boolean(board.responseWindow);
  const priority = view.status === "waiting" ? "opponent" : "you";
  const step = response
    ? "Response"
    : board.clash
      ? (clashSteps[board.clash.step] ?? board.clash.step)
      : board.phaseStep === "resource"
        ? "Resource"
        : board.phaseStep === "draw"
          ? "Draw"
          : undefined;
  const actions: ArenaTurnConsoleAction[] = [];
  for (const action of view.actions) {
    if (response && action.id === "passClashStep") continue;
    let label: string;
    let kind: ArenaTurnConsoleAction["kind"] = "advance";
    let description: string;
    switch (action.id) {
      case "initiateClash":
        label = "Start Clash";
        kind = "clash";
        description =
          "Choose a legal attacker and target. The turn continues in Primary after the Clash.";
        break;
      case "endTurn":
        label = "End turn";
        description = "End your Primary phase and resolve end-of-turn effects.";
        break;
      case "passResource":
        label = "Skip resource";
        description = "Continue to Primary without deploying a resource.";
        break;
      case "passCounter":
        label = "Pass response";
        kind = "pass";
        description = "Pass priority in this response window. This does not end the turn.";
        break;
      case "declareObstructors":
        label = "Choose obstructors";
        kind = "confirm";
        description = "Choose legal Clash cards to obstruct the attack.";
        break;
      case "passObstruct":
        label = "No obstruction";
        kind = "pass";
        description = "Continue the Clash without declaring obstructors.";
        break;
      case "passClashStep":
        label =
          board.clash?.step === "beforeDamage"
            ? "Pass response"
            : board.clash?.step === "counter"
              ? "Pass counters"
              : "Skip buff";
        kind = "pass";
        description = "Continue from the current Clash step without playing a card.";
        break;
      default:
        continue;
    }
    actions.push({
      id: action.id,
      label,
      kind,
      description,
      disabledReason: action.enabled ? undefined : "This action is not available.",
    });
  }
  actions.sort((a, b) => Number(b.kind === "clash") - Number(a.kind === "clash"));
  const choosing = view.status === "choosing";
  const instruction = choosing
    ? resolveInteractionText(
        view.actions.find((a) => a.enabled && a.id.startsWith("resolveChoice:"))?.text ?? {
          key: "Complete the required choice.",
        },
      )
    : response
      ? priority === "you"
        ? "Play a legal response, or pass priority."
        : "Your opponent can respond."
      : phase === "expansion"
        ? "Deploy one eligible card from your hand, or skip the Resource Step."
        : phase === "clash"
          ? priority === "opponent"
            ? "Waiting for your opponent’s combat choice."
            : board.clash?.step === "obstruct"
              ? "Click highlighted cards to obstruct, or choose No obstruction."
              : board.clash?.step === "attackerBuff" || board.clash?.step === "defenderBuff"
                ? "Play a highlighted Clash Buff from your hand, or skip the buff."
                : "Play a legal response, or pass priority."
          : phase === "end"
            ? "Resolve end-of-turn effects."
            : phase === "start"
              ? "Resolve start-of-turn effects."
              : priority === "you"
                ? "Play cards, start a legal Clash, or end your turn."
                : "Your opponent is taking their turn.";
  return {
    phase,
    step,
    priority,
    instruction,
    actions,
    turnOwner: board.activePlayer === viewerSeat ? "you" : "opponent",
    turnNumber: board.turnNumber,
  } as const;
}
