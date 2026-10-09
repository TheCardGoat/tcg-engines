import { describe } from "vitest";
import { sacramentalRite } from "./sacramental-rite.ts";
import {
  proveBanishedMaterialPlay,
  proveBanishedPreservedAction,
} from "../../../testing/banished-material-play.ts";
/** @covers TL19V7lU6A-a2 */
describe("sacramentalRite linked banishment and play", () =>
  proveBanishedMaterialPlay(sacramentalRite, "TL19V7lU6A-a3", true));

/** @covers TL19V7lU6A-a3 */
describe("sacramentalRite preserved action", () =>
  proveBanishedPreservedAction(sacramentalRite, "TL19V7lU6A-a3"));
