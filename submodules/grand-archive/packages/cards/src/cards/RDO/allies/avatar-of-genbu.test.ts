import { describe } from "vitest";
import { avatarOfGenbu } from "./avatar-of-genbu.ts";
import { fabledSapphireFatestone } from "../../HVN/items/fabled-sapphire-fatestone.ts";
import { fabledRubyFatestone } from "../../HVN/items/fabled-ruby-fatestone.ts";
import { proveAvatarFatestone } from "../../../testing/avatar-fatestone.ts";
/** @covers 67CIhG8hmG-a2 */
describe("Avatar of genbu — sacrifice", () =>
  proveAvatarFatestone(avatarOfGenbu, fabledSapphireFatestone, fabledRubyFatestone));
