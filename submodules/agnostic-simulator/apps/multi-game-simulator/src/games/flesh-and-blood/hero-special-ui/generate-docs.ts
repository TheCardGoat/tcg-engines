import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderAllHeroTextFixtures, renderUxHandoffTable } from "./textFixtures";

const here = dirname(fileURLToPath(import.meta.url));

writeFileSync(join(here, "text-fixtures.md"), renderAllHeroTextFixtures(), "utf8");
writeFileSync(join(here, "UX_HANDOFF.md"), renderUxHandoffTable(), "utf8");
