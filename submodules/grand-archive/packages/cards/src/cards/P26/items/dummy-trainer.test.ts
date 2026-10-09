import { describe } from "vitest";
import { dummyTrainer } from "./dummy-trainer.ts";
import { proveBanishSummonMemory } from "../../../testing/banish-summon-memory.ts";
/** @covers QCUld5Xidm-a1 */
describe("Dummy Trainer's memory draw and opposing token", () =>
  proveBanishSummonMemory(dummyTrainer, "QCUld5Xidm-a1", true));
