import { describe, expect, it } from "bun:test";
import { gantuCaptainCrankyhead } from "./189-gantu-captain-crankyhead";

describe("Gantu - Captain Crankyhead", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(gantuCaptainCrankyhead.vanilla).toBe(true);
    expect(gantuCaptainCrankyhead.abilities).toBeUndefined();
    expect(gantuCaptainCrankyhead.cost).toBe(5);
    expect(gantuCaptainCrankyhead.strength).toBe(4);
    expect(gantuCaptainCrankyhead.willpower).toBe(3);
    expect(gantuCaptainCrankyhead.lore).toBe(4);
    expect(gantuCaptainCrankyhead.inkable).toBe(true);
  });
});
