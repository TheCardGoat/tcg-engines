import type { LobbyEvent } from "./event-bus";
import type { CombinedLobbyState } from "./lobby-engine-types";
import type { TransportMessage } from "./side-effects-adapter";
import { BaseSideEffectsAdapter } from "./side-effects-adapter";
/**
 * Example adapter that demonstrates how to implement a SideEffectsAdapter
 * with event handling capabilities
 */
export declare class ExampleSideEffectsAdapter<T = unknown, C = unknown> extends BaseSideEffectsAdapter<T, C> {
    constructor();
    broadcast(message: TransportMessage<T, C>, targets?: string[]): void;
    onMessageReceived(message: TransportMessage<T, C>, clientId?: string): void;
    createMatch(lobby: CombinedLobbyState<T, C>): boolean;
    onLobbyEvent: (event: LobbyEvent<T, C>) => void;
    private updatePlayerStatus;
    private notifyExternalSystems;
    private handleTimeout;
    toJSON(): unknown;
    setEngine(): void;
}
//# sourceMappingURL=example-adapter.d.ts.map