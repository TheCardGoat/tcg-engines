import { describe, expect, test } from "vitest";
import { playerIdentitiesByActorOrSeat } from "./sides";

describe("playerIdentitiesByActorOrSeat", () => {
  const participants = [
    { id: "seat-1", seat: 1, displayName: "Ada", playmatId: "maelstrom" },
    { id: "seat-2", seat: 2, displayName: "Bo", playmatId: "street-fire" },
  ];

  test("maps a seated viewer by actor id", () => {
    expect(
      playerIdentitiesByActorOrSeat(participants, { player: "seat-2", opponent: "seat-1" }),
    ).toEqual({
      player: participants[1],
      opponent: participants[0],
    });
  });

  test("maps spectators by seat so both playmats stay visible", () => {
    expect(playerIdentitiesByActorOrSeat(participants, undefined)).toEqual({
      player: participants[0],
      opponent: participants[1],
    });
  });
});
