import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId, MoveLog } from "@tcg/lorcana-engine";
import { composeMoveLogForViewer, formatEventLogBody } from "./event-log-formatting.js";
import type { MoveLogEntrySnapshot } from "./contracts.js";

const player = "player_one" as PlayerId;
const source = "scout" as CardInstanceId;
const character = "character" as CardInstanceId;
const action = "action" as CardInstanceId;
const log: MoveLog = {
  moveType: "resolveEffect",
  playerId: player,
  timestamp: 1,
  public: [
    {
      key: "lorcana.effect.resolve.scrySelection.detail",
      values: {
        playerId: player,
        sourceCardId: source,
        selection: [],
        destinations: [{ zone: "hand", cardIds: [character] }],
      },
    },
  ],
  privateByPlayerId: {
    [player]: [
      {
        key: "lorcana.private.effect.resolve.scrySelection.detail",
        values: {
          playerId: player,
          sourceCardId: source,
          selection: [],
          destinations: [
            { zone: "hand", cardIds: [character] },
            { zone: "deck-bottom", cardIds: [action] },
          ],
        },
      },
    ],
  },
};

describe("scry log visibility", () => {
  it("does not restore hidden destinations from raw move input for opponents or spectators", () => {
    const privateLook: MoveLog = {
      ...log,
      public: [
        {
          key: "lorcana.effect.resolve.scrySelection",
          values: { playerId: player, sourceCardId: source },
        },
      ],
    };
    for (const viewer of ["player_two", null]) {
      const entry: MoveLogEntrySnapshot = {
        id: "private-look",
        moveId: "resolveEffect",
        playerId: player,
        actorSide: "playerOne",
        timestamp: 1,
        turnNumber: 1,
        title: "",
        params: { params: { destinations: [{ zone: "deck-bottom", cards: [action] }] } },
        typedLogEntry: composeMoveLogForViewer(privateLook, viewer),
      };
      const body = formatEventLogBody(entry, "playerTwo", "en", (id) => ({
        label: id === action ? "SECRET CARD" : "Source",
      }));
      expect(body.text).not.toContain("SECRET CARD");
      expect(
        body.segments.some((segment) => segment.kind === "card" && segment.cardId === action),
      ).toBe(false);
    }
  });
  it("uses the chooser's full detail once instead of repeating the public subset", () => {
    const visible = composeMoveLogForViewer(log, player);
    expect(visible.public).toHaveLength(1);
    expect(visible.public[0]?.key).toBe("lorcana.private.effect.resolve.scrySelection.detail");
  });
  it("keeps public identities for opponents and spectators without exposing private cards", () => {
    expect(composeMoveLogForViewer(log, "player_two").public).toEqual(log.public);
    expect(composeMoveLogForViewer(log).public).toEqual(log.public);
  });
});
