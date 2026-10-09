import { describe } from "vitest";
import { avatarOfSuzaku } from "./avatar-of-suzaku.ts";
import { fabledRubyFatestone } from "../../HVN/items/fabled-ruby-fatestone.ts";
import { fabledEmeraldFatestone } from "../../HVN/items/fabled-emerald-fatestone.ts";
import { proveAvatarFatestone } from "../../../testing/avatar-fatestone.ts";
/** @covers jjGLZKfRn5-a2 */
describe("Avatar of suzaku — sacrifice", () =>
  proveAvatarFatestone(avatarOfSuzaku, fabledRubyFatestone, fabledEmeraldFatestone));
