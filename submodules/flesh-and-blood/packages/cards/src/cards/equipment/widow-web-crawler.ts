import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/widow-web-crawler.generated.ts";
import { arcaneBarrier, spellvoid } from "../shared/keywords.ts";

export const widowWebCrawler = defineCard(fabCardIdentitiesByCanonicalId["6QKhRnpgcFmhcGgQKNH8K"], {
  keywords: [arcaneBarrier(1), spellvoid(1)],
});
