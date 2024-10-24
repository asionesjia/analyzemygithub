import { type Config } from 'drizzle-kit'
import { envServer } from '~/env/server'

export default {
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: envServer.DATABASE_URL,
  },
  tablesFilter: ['analyzemygithub_*'],
} satisfies Config
