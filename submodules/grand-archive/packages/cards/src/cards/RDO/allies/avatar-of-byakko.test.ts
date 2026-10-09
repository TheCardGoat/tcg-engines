import { describe } from "vitest";
import { avatarOfByakko } from "./avatar-of-byakko.ts";
import { fabledEmeraldFatestone } from "../../HVN/items/fabled-emerald-fatestone.ts";
import { fabledSapphireFatestone } from "../../HVN/items/fabled-sapphire-fatestone.ts";
import { proveAvatarFatestone } from "../../../testing/avatar-fatestone.ts";
/** @covers TjiH4U35bv-a2 */
describe("Avatar of byakko — sacrifice", () =>
  proveAvatarFatestone(avatarOfByakko, fabledEmeraldFatestone, fabledSapphireFatestone));
