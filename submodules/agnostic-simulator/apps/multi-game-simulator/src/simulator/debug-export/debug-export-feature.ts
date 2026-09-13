export interface SimulatorDebugExportFeatureEnvironment {
  readonly DEPLOYMENT_ENVIRONMENT?: string;
  readonly NODE_ENV?: string;
  readonly RAILWAY_ENVIRONMENT_NAME?: string;
  readonly SIMULATOR_DEBUG_EXPORT_ENABLED?: string;
  readonly VITE_OTEL_DEPLOYMENT_ENVIRONMENT?: string;
}

export function isSimulatorDebugExportEnabled(
  environment: SimulatorDebugExportFeatureEnvironment,
): boolean {
  const deploymentEnvironment =
    environment.DEPLOYMENT_ENVIRONMENT ??
    environment.RAILWAY_ENVIRONMENT_NAME ??
    environment.VITE_OTEL_DEPLOYMENT_ENVIRONMENT ??
    environment.NODE_ENV;
  return (
    deploymentEnvironment !== "production" && environment.SIMULATOR_DEBUG_EXPORT_ENABLED === "true"
  );
}
