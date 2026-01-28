import { jsonResponse, errorResponse, type CFContext } from '../../env'

const VALID_STATUSES = ['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled']

export async function onRequestGet(context: CFContext) {
  const db = context.env.DB
  const id = context.params.id as string

  try {
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()

    if (!order) {
      return errorResponse('Order not found', 404)
    }

    const { results: items } = await db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .bind(id)
      .all()

    const parsedItems = items.map((item) => ({
      ...item,
      services: JSON.parse(item.services as string),
    }))

    return jsonResponse({ ...order, items: parsedItems })
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to fetch order: ' + message, 500)
  }
}

export async function onRequestPut(context: CFContext) {
  const db = context.env.DB
  const id = context.params.id as string

  try {
    const body = await context.request.json() as { status?: string; notes?: string }

    // Verify order exists
    const existing = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()
    if (!existing) {
      return errorResponse('Order not found', 404)
    }

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return errorResponse('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '))
    }

    const newStatus = body.status || existing.status
    const newNotes = body.notes !== undefined ? body.notes : existing.notes

    await db
      .prepare("UPDATE orders SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(newStatus, newNotes, id)
      .run()

    const updated = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()
    return jsonResponse(updated)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to update order: ' + message, 500)
  }
}
