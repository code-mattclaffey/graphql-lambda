# GraphQl Lambda

### Summary

This typescript project sets up a serverless GraphQL API using Apollo Server, EsBuild, and AWS Lambda. It leverages the as-integrations/aws-lambda package to run Apollo's GraphQL server as an AWS Lambda function.

### Setting up dev environment

Check out vscode extensions/recommended to have the best linting/syntax highlighting experience as graphQL is not supported by default.

### Available commands

- `npm ci` => Cleanly installs dependencies based on the package-lock.json
- `npm run build` => Compiles, bundles, then zips the code so it is ready for production
- `npm run dev` => Run the project in develoment mode
- `npm run test` => runs the unit test suite - not yet implemented

### Rough folder structure:

```
├── src
│   ├── dev
│   │   └── server.ts
│   ├── schema
│   │   └── schema.ts
│   ├── types
│   ├── handler.ts          // File for handling specific functionality or routes
│   └── index.ts            // Entry point for the application
├── package.json
├── tsconfig.json
└── other configuration files e.g. tsconfig, viteconfig, nodemon, codegen
```

### APIs mocks

We use Mock Service Worker (v2) to mock API response calls.
These live in mocks/handlers in their respective folders, and are combined in mocks/handlers/index.ts

Static mock data for these live in mocks/handlers/fixtures

### Integration tests

Integration tests use the express server code in dev/server.ts to test the graphQL resolver file directly, in combination with MSW.

### Example .env to work locally

```.env
```
