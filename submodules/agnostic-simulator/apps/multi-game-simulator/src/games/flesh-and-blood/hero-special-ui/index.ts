export {
  HERO_SPECIAL_UI_CATALOG,
  getHeroSpecialUi,
  listHeroesByTier,
  listHeroesWithTextFixtures,
  type FabHeroSpecialTier,
  type FabHeroSpecialUiId,
  type FabHeroSpecialUiRequirement,
} from "./catalog";

export { FAB_UI_MODULES, getFabUiModule, type FabUiModule, type FabUiModuleId } from "./modules";

export {
  FAB_HERO_TEXT_FIXTURES,
  getHeroTextFixture,
  renderAllHeroTextFixtures,
  renderUxHandoffTable,
  type FabHeroTextFixture,
} from "./textFixtures";

export {
  FAB_HERO_SPECIAL_SCENARIO_GROUP,
  FAB_HERO_SPECIAL_SCENARIOS,
  getHeroSpecialScenario,
  assertAllHeroSpecialScenariosBoot,
  type FabHeroSpecialScenario,
} from "./visualScenarios";
