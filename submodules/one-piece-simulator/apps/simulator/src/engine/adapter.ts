import type {
  ApplyCommandResult,
  EngineCommand,
  LegalCommandDescriptor,
  MatchConfig,
  MatchState,
  PlayerView,
  Viewer,
} from "../../../../packages/engine/src/index";

export type EngineUpdateListener = (result: ApplyCommandResult, state: MatchState) => void;

export interface EngineAdapter {
  getState(): Promise<MatchState>;
  getView(viewer: Viewer): Promise<PlayerView>;
  getLegalCommands(viewer?: Viewer): Promise<LegalCommandDescriptor[]>;
  applyCommand(command: EngineCommand): Promise<ApplyCommandResult>;
  subscribe(listener: EngineUpdateListener): () => void;
}

export interface RemoteEngineTransport {
  getState(): Promise<MatchState>;
  getView(viewer: Viewer): Promise<PlayerView>;
  getLegalCommands(viewer?: Viewer): Promise<LegalCommandDescriptor[]>;
  applyCommand(command: EngineCommand): Promise<ApplyCommandResult>;
  subscribe?(listener: EngineUpdateListener): () => void;
}

export interface LocalAdapterConfig extends MatchConfig {}
