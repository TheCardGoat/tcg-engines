import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-might-and-magic.generated.ts";
import { bladeBreak, spellvoid } from "../shared/keywords.ts";

export const helmOfMightAndMagic = defineCard(
  fabCardIdentitiesByCanonicalId["rcjgBWntdrDcMT7gHdgjF"],
  {
    keywords: [bladeBreak, spellvoid(1)],
  },
);
