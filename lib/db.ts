import 'server-only'

import mysql, { type Pool, type PoolOptions, type RowDataPacket } from 'mysql2/promise'

let pool: Pool | undefined

function getPool() {
  if (!pool) {
    const options: PoolOptions = {
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME ?? 'lab_management',
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    }
    pool = mysql.createPool(options)
  }
  return pool
}

export type DbRow = RowDataPacket & Record<string, unknown>
export type DbParams = Record<string, string | number | boolean | Date | null>

export async function query<T extends DbRow[]>(sql: string, params?: DbParams) {
  const [rows] = await getPool().execute<T>({ sql, namedPlaceholders: true }, params)
  return rows
}

export async function execute(sql: string, params?: DbParams) {
  const [result] = await getPool().execute({ sql, namedPlaceholders: true }, params)
  return result
}

export async function withTransaction<T>(callback: (connection: Awaited<ReturnType<Pool['getConnection']>>) => Promise<T>) {
  const connection = await getPool().getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
