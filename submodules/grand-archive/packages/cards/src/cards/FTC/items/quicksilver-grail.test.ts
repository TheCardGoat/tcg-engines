import { describe } from "vitest";
import { quicksilverGrail } from "./quicksilver-grail.ts";
import {
  proveBanishedMaterialPlay,
  proveBanishedPreservedAction,
} from "../../../testing/banished-material-play.ts";
/** @covers cxyky280mt-a2 */
describe("quicksilverGrail linked banishment and play", () =>
  proveBanishedMaterialPlay(quicksilverGrail, "cxyky280mt-a3"));

/** @covers cxyky280mt-a3 */
describe("quicksilverGrail preserved action", () =>
  proveBanishedPreservedAction(quicksilverGrail, "cxyky280mt-a3"));
