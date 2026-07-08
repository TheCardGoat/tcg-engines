/**
 * Immutable package produced when one game command is processed.
 *
 * Engines own the native state, command, log, event, and animation shapes.
 * Shared simulator/runtime code only needs the temporal relationship: which
 * state was visible before the command, which state is authoritative after it,
 * and which animation plan belongs to that exact transition.
 */
export interface SimulatorMoveResolution<
  TState,
  TCommand = unknown,
  TLog = unknown,
  TEvent = unknown,
  TAnimation = unknown,
> {
  readonly moveId: string;
  readonly stateVersion: number;
  readonly fromState: TState;
  readonly toState: TState;
  readonly command: TCommand;
  readonly logs: readonly TLog[];
  readonly events: readonly TEvent[];
  readonly animations: readonly TAnimation[];
  readonly correlationId?: string;
}
