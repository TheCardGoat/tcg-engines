import type {
  BoardToken,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorTable,
} from "@tcg/simulator-contract";

export type OnePieceSeatId = "opponent" | "player";

export interface OnePieceStaticBoard {
  table: SimulatorTable;
  entities: SimulatorEntity[];
  eventLog: SimulatorEventLogEntry[];
  donTokens: Record<OnePieceSeatId, BoardToken[]>;
  fixture: {
    id: string;
    label: string;
    description: string;
  };
}
