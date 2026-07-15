import { describe, expect, it } from "bun:test";
import { gadgetHackwrenchPerceptiveMouse } from "./151-gadget-hackwrench-perceptive-mouse";

describe("Gadget Hackwrench - Perceptive Mouse", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(gadgetHackwrenchPerceptiveMouse.vanilla).toBe(true);
    expect(gadgetHackwrenchPerceptiveMouse.abilities).toBeUndefined();
    expect(gadgetHackwrenchPerceptiveMouse.cost).toBe(2);
    expect(gadgetHackwrenchPerceptiveMouse.strength).toBe(2);
    expect(gadgetHackwrenchPerceptiveMouse.willpower).toBe(3);
    expect(gadgetHackwrenchPerceptiveMouse.lore).toBe(1);
    expect(gadgetHackwrenchPerceptiveMouse.inkable).toBe(true);
  });
});
