# MySQL setup

1. Copy `.env.example` to `.env.local` and set the MySQL credentials.
2. Apply the schema:

```bash
mysql --host=%DB_HOST% --port=%DB_PORT% --user=%DB_USER% --password=%DB_PASSWORD% < database/schema.sql
```

3. Load the reference data:

```bash
pnpm db:seed
```

The server-only database connection is in `lib/db.ts`. Read repositories are in `lib/repositories.ts`.

The current client screens still use the legacy exports in `lib/data.ts`; migrating those screens requires server actions or API routes because MySQL connections cannot run in client components.
