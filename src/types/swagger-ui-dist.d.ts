declare module "swagger-ui-dist/swagger-ui-bundle" {
  interface SwaggerUIBundleType {
    (config: Record<string, unknown>): { unmount?: () => void };
    presets: { apis: unknown };
    SwaggerUIStandalonePreset: unknown;
  }
  const SwaggerUIBundle: SwaggerUIBundleType;
  export default SwaggerUIBundle;
}
