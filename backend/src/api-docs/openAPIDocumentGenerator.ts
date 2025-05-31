import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';
import { authRegistry } from '@/api/auth/authRouter'; 
import { tokenRegistry } from '@/api/tokens/tokenRouter';
import { leaderboardRegistry } from '@/api/leaderboard/leaderboardRouter';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, authRegistry, tokenRegistry, leaderboardRegistry]);
  
  // Register security scheme in the registry
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  });
}
