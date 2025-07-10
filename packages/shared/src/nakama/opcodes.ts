/**
 * The complete set of opcodes used for communication between clients and server.
 */
export enum OpCode {
  INITIALIZE_STATE = 1,
  // Move was rejected.
  REJECTED = 5,
  // Opponent has left the game.
  OPPONENT_LEFT = 6,
  PLAYER_JOINED = 7,
  SYNC_GAME_STATE = 8,

  UPDATE_TIMERS = 9,

  DROP_PLAYER = 70,

  UNDO_TURN = 71,
  UNDO_MOVE = 72,

  // Replace the whole state
  REPLACE_STATE = 99,
  CONCEDE_GAME = 100,
  // Lorcanito state contains the state of the game, while Nakama state contains the state of the match and Nakama's metadata.
  UPDATE_CLIENT_LORCANITO_STATE = 100,

  REQUEST_THINKING_TIME = 200,
  SEND_THINKING_TIME = 201,
  REQUEST_MATCH_STATE = 202,
  REQUEST_REMATCH = 203,

  NOTIFY_GAME_WINNER = 500,
  NOTIFY_MATCH_WINNER = 501,

  SET_ID_MAP = 502,
  SET_MATCH_METADATA = 503,

  UNDO_CLIENT_GAME_STATE = 997,
  UPDATE_CLIENT_GAME_STATE = 998,
  UPDATE_CLIENT_MATCH_STATE = 996,
  // Lorcanito state contains the state of the game, while Nakama state contains the state of the match and Nakama's metadata.
  // DEPRECATED, the state grew too much.
  UPDATE_CLIENT_NAKAMA_STATE = 999,
}
