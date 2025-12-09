export var ServerMessageType;
(function (ServerMessageType) {
    ServerMessageType[ServerMessageType["PLAYER_JOINED"] = 1000] = "PLAYER_JOINED";
    ServerMessageType[ServerMessageType["PLAYER_LEFT"] = 1001] = "PLAYER_LEFT";
    ServerMessageType[ServerMessageType["PLAYER_ACCEPTED"] = 1004] = "PLAYER_ACCEPTED";
    ServerMessageType[ServerMessageType["PLAYER_REJECTED"] = 1005] = "PLAYER_REJECTED";
    ServerMessageType[ServerMessageType["UPDATE_STATE"] = 1099] = "UPDATE_STATE";
    ServerMessageType[ServerMessageType["MESSAGE_REJECTED"] = 10100] = "MESSAGE_REJECTED";
})(ServerMessageType || (ServerMessageType = {}));
export var ClientMessageType;
(function (ClientMessageType) {
    ClientMessageType[ClientMessageType["ACCEPT_LOBBY"] = 1] = "ACCEPT_LOBBY";
    ClientMessageType[ClientMessageType["REJECT_LOBBY"] = 2] = "REJECT_LOBBY";
    ClientMessageType[ClientMessageType["LOBBY_TIMED_OUT"] = 3] = "LOBBY_TIMED_OUT";
    ClientMessageType[ClientMessageType["FORCE_SYNC"] = 99] = "FORCE_SYNC";
})(ClientMessageType || (ClientMessageType = {}));
//# sourceMappingURL=lobby-messages-type.js.map