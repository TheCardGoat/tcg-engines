import type { MatchInitParams } from "./match-init";

/**
 * Payload for creating a match RPC call
 */
export type CreateMatchRpcPayload = MatchInitParams;

/**
 * Response from creating a match RPC call
 */
export type CreateMatchRpcResponse = string;

/**
 * Payload for getting a match by Nakama ID RPC call
 */
export type GetMatchByNakamaIdRpcPayload = {
  matchId: string;
};

/**
 * Response from getting a match by Nakama ID RPC call
 */
export type GetMatchByNakamaIdRpcResponse = {
  match: Record<string, unknown>;
  presences: Array<{
    user_id: string;
    session_id: string;
    username: string;
    node?: string;
  }>;
  self?: {
    user_id: string;
    session_id: string;
    username: string;
    node?: string;
  };
  label?: string;
  size?: number;
  tick_rate?: number;
  handler_name: string;
};
