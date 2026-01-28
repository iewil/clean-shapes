import { jsonResponse, errorResponse, type CFContext } from '../../env'

async function fetchGroupedParameters(db: D1Database) {
  const { results } = await db
    .prepare('SELECT * FROM pricing_parameters ORDER BY category, id')
    .all()

  const grouped: Record<string, unknown[]> = {}
  for (const row of results) {
    const category = row.category as string
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(row)
  }

  return grouped
}

export async function onRequestGet(context: CFContext) {
  const db = context.env.DB

  try {
    const grouped = await fetchGroupedParameters(db)
    return jsonResponse(grouped)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to fetch parameters: ' + message, 500)
  }
}

export async function onRequestPut(context: CFContext) {
  const db = context.env.DB

  try {
    const body = await context.request.json() as { updates: Array<{ id: string; value: number }> }

    if (!body.updates || !Array.isArray(body.updates)) {
      return errorResponse('Missing required field: updates (array)')
    }

    for (const update of body.updates) {
      if (!update.id || update.value === undefined) {
        return errorResponse('Each update must have an id and value')
      }

      await db
        .prepare("UPDATE pricing_parameters SET value = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(update.value, update.id)
        .run()
    }

    const grouped = await fetchGroupedParameters(db)
    return jsonResponse(grouped)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to update parameters: ' + message, 500)
  }
}
