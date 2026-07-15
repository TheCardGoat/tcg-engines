import { registerBotLabAdapter } from "../registry.ts";
import { cyberpunkBotLabAdapter } from "./cyberpunk.ts";
import { gundamBotLabAdapter } from "./gundam.ts";
import { lorcanaBotLabAdapter } from "./lorcana.ts";
import { onePieceBotLabAdapter } from "./one-piece.ts";

registerBotLabAdapter(cyberpunkBotLabAdapter);
registerBotLabAdapter(gundamBotLabAdapter);
registerBotLabAdapter(lorcanaBotLabAdapter);
registerBotLabAdapter(onePieceBotLabAdapter);
