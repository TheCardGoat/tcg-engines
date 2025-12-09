import type { LobbyEngine, LobbyOptions } from "./lobby-engine-types";
import type { TransportMessage } from "./side-effects-adapter";
export declare function createLobbyEngine<State = unknown, Context extends {
    id: string;
    presence: unknown;
} = {
    id: string;
    presence: unknown;
}, BroadcastMessage extends TransportMessage<State, Context> = TransportMessage<State, Context>, ReceiveMessage extends TransportMessage<State, Context> = TransportMessage<State, Context>>(options: LobbyOptions<State, Context>): LobbyEngine<State, Context, BroadcastMessage, ReceiveMessage>;
//# sourceMappingURL=lobby-engine.d.ts.map