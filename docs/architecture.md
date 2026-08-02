# Architecture

## Client

The React client is a Vite-powered TypeScript application.

- `components/` contains reusable interface pieces.
- `hooks/` owns reusable stateful behavior.
- `services/` is the only layer that calls the HTTP API.
- `types/` contains client-side API contracts.

The first card-browser milestone performs filtering and sorting in the browser. This is appropriate for the small initial card set. Server-side querying can be added when the collection becomes large.

## Server

The Express server uses a route/controller/service structure:

- routes map URLs to controller functions
- controllers validate request input and shape responses
- services contain database operations
- Prisma provides typed SQLite access

## Database

SQLite is the local development database. Prisma migrations define the schema, and the seed script inserts sample Fairtravel Battle cards.
