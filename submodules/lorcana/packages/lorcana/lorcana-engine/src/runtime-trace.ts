import type { CardInstanceId, PlayerId } from "#core";
import { getLogger } from "@logtape/logtape";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

const logger = getLogger(["lorcana-engine", "runtime-trace"]);

type TraceValue =
  | string
  | number
  | boolean
  | null
  | readonly TraceValue[]
  | { readonly [key: string]: TraceValue };

type TracePayload = Record<string, TraceValue>;

export interface LorcanaRuntimeTraceStep {
  kind: string;
  message: string;
  moveId?: string;
  playerId?: string;
  cardId?: CardInstanceId;
  cardName?: string;
  bagItemId?: string;
  effectId?: string;
  payload?: TracePayload;
}

type RuntimeTraceListener = (step: LorcanaRuntimeTraceStep) => void;

const listeners = new Set<RuntimeTraceListener>();

function getProcessEnv(): Record<string, string | undefined> | undefined {
  const processGlobal = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return processGlobal.process?.env;
}

export function isLorcanaRuntimeTraceEnabled(): boolean {
  const envValue = getProcessEnv()?.LORCANA_RUNTIME_TRACE?.trim().toLowerCase();
  if (!envValue) {
    return false;
  }

  return envValue !== "0" && envValue !== "false" && envValue !== "off";
}

export function addLorcanaRuntimeTraceListener(listener: RuntimeTraceListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function traceLorcanaRuntimeStep(step: LorcanaRuntimeTraceStep): void {
  if (!isLorcanaRuntimeTraceEnabled()) {
    return;
  }

  listeners.forEach((listener) => listener(step));

  const properties: Record<string, TraceValue> = {
    kind: step.kind,
  };

  if (step.moveId) {
    properties.moveId = step.moveId;
  }
  if (step.playerId) {
    properties.playerId = step.playerId;
  }
  if (step.cardId) {
    properties.cardId = step.cardId;
  }
  if (step.cardName) {
    properties.cardName = step.cardName;
  }
  if (step.bagItemId) {
    properties.bagItemId = step.bagItemId;
  }
  if (step.effectId) {
    properties.effectId = step.effectId;
  }
  if (step.payload) {
    properties.payload = step.payload;
  }

  logger.info(step.message, properties);
}

export function formatLorcanaPlayerLabel(playerId: string | PlayerId | undefined): string {
  switch (playerId) {
    case "player_one":
      return "Player One";
    case "player_two":
      return "Player Two";
    case "spectator":
      return "Spectator";
    case undefined:
      return "Unknown Player";
    default:
      return String(playerId);
  }
}

export function formatLorcanaCardName(
  card:
    | (Pick<LorcanaCardDefinition, "name"> & {
        fullName?: string | null;
        version?: string | null;
      })
    | undefined,
): string | undefined {
  if (!card) {
    return undefined;
  }

  if (typeof card.fullName === "string" && card.fullName.length > 0) {
    return card.fullName;
  }

  if (typeof card.version === "string" && card.version.length > 0) {
    return `${card.name} - ${card.version}`;
  }

  return card.name;
}

export function getLorcanaCardName(
  cardId: CardInstanceId | undefined,
  getDefinitionById: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined,
): string | undefined {
  if (!cardId) {
    return undefined;
  }

  return formatLorcanaCardName(getDefinitionById(cardId));
}
