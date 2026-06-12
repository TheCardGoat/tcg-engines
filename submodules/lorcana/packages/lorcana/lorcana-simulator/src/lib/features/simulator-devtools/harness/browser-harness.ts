import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import type {
  BrowserTransportConfig,
  BrowserTransportLatencyModel,
  BrowserTransportMode,
} from "@tcg/lorcana-engine/testing";
import type { SimulatorDebugAnimationRequest } from "@/features/simulator/animations/board-move-animations";
import type { LorcanaSimulatorView, LorcanaZoneId } from "@/features/simulator/model/contracts.js";
import { LORCANA_SIMULATOR_FIXTURES } from "@/features/simulator-devtools/fixtures";
import { fullBoardAllCardTypes } from "@/features/simulator-devtools/fixtures/full-board-all-card-types";

export const PLAYER_ONE = "player_one" as const;
export const PLAYER_TWO = "player_two" as const;

export type CanonicalPlayerId = typeof PLAYER_ONE | typeof PLAYER_TWO;

export const LORCANA_HARNESS_DEFAULT_FIXTURE = LORCANA_SIMULATOR_FIXTURES[fullBoardAllCardTypes.id];
export const LORCANA_HARNESS_DEFAULT_FIXTURE_ID = LORCANA_HARNESS_DEFAULT_FIXTURE.id;
export const LORCANA_HARNESS_DEFAULT_VIEW: LorcanaSimulatorView = "playerOne";
export const LORCANA_HARNESS_DEFAULT_BROWSER_TRANSPORT: BrowserTransportConfig = {
  mode: "async",
  latencyMs: 0,
  latencyModel: "one-way",
};

export interface LorcanaBrowserStatus {
  stateID: number;
  openingTurnPlayer?: CanonicalPlayerId;
  pendingMulligan: CanonicalPlayerId[];
  priorityPlayer?: CanonicalPlayerId;
  choosingFirstPlayer?: CanonicalPlayerId;
  phase?: string;
  gameSegment?: string;
  turnNumber: number;
  zoneCounts: Record<string, Record<LorcanaZoneId, number>>;
}

export interface LorcanaBrowserHarnessExecuteResult {
  success: boolean;
  reason?: string;
  code?: string;
}

export interface LorcanaBrowserHarnessConfig {
  fixtureId: string;
  latencyModel?: BrowserTransportLatencyModel;
  latencyMs?: number;
  transport: BrowserTransportMode;
  view: LorcanaSimulatorView;
}

export interface LorcanaBrowserHarness {
  getConfig(): LorcanaBrowserHarnessConfig;
  reset(): Promise<void>;
  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params?: Record<string, unknown>,
  ): Promise<LorcanaBrowserHarnessExecuteResult>;
  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView>;
  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus>;

  runAnimation(animation: SimulatorDebugAnimationRequest): Promise<boolean>;
}

export type LorcanaSerializedMatchState = {
  ctx?: {
    priority?: {
      holder?: CanonicalPlayerId;
    };
    status?: {
      otp?: CanonicalPlayerId;
      pendingMulligan?: CanonicalPlayerId[];
      choosingFirstPlayer?: CanonicalPlayerId;
      phase?: string;
      gameSegment?: string;
      turn?: number;
    };
    zones?: {
      private?: {
        zoneCards?: Record<string, string[]>;
      };
    };
  };
};

export function isCanonicalPlayerId(value: string): value is CanonicalPlayerId {
  return value === PLAYER_ONE || value === PLAYER_TWO;
}

export function toSimulatorView(
  playerId: CanonicalPlayerId,
): Extract<LorcanaSimulatorView, "playerOne" | "playerTwo"> {
  return playerId === PLAYER_ONE ? "playerOne" : "playerTwo";
}

export function toCanonicalPlayerId(
  view: Extract<LorcanaSimulatorView, "playerOne" | "playerTwo">,
): CanonicalPlayerId {
  return view === "playerOne" ? PLAYER_ONE : PLAYER_TWO;
}
