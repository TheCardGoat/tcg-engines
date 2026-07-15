import { describe, expect, it } from "bun:test";
import { yokaiProfessorCallaghan } from "./158-yokai-professor-callaghan";

describe("Yokai - Professor Callaghan", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(yokaiProfessorCallaghan.vanilla).toBe(true);
    expect(yokaiProfessorCallaghan.abilities).toBeUndefined();
    expect(yokaiProfessorCallaghan.cost).toBe(1);
    expect(yokaiProfessorCallaghan.strength).toBe(2);
    expect(yokaiProfessorCallaghan.willpower).toBe(2);
    expect(yokaiProfessorCallaghan.lore).toBe(1);
    expect(yokaiProfessorCallaghan.inkable).toBe(true);
  });
});
