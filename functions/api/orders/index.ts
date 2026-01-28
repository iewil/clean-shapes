import { jsonResponse, errorResponse, type CFContext } from '../../env'

export async function onRequestGet(context: CFContext) {
  const db = context.env.DB

  try {
    const url = new URL(context.request.url)
    const status = url.searchParams.get('status')

    let query: string
    let bindings: string[] = []

    if (status) {
      query = 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC'
      bindings = [status]
    } else {
      query = 'SELECT * FROM orders ORDER BY created_at DESC'
    }

    const stmt = bindings.length > 0
      ? db.prepare(query).bind(...bindings)
      : db.prepare(query)

    const { results } = await stmt.all()
    return jsonResponse(results)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to fetch orders: ' + message, 500)
  }
}

export async function onRequestPost(context: CFContext) {
  const db = context.env.DB

  try {
    const body = await context.request.json() as {
      customer: { firstName: string; lastName: string; email: string; phone: string }
      shipping: { address1: string; address2?: string; city: string; state: string; zip: string; country: string }
      items: Array<{
        name: string; type: string; materialId: string; materialName: string
        thickness: string; quantity: number; width: number; height: number
        services: string[]; unitPrice: number; subtotal: number
        fileName?: string; fileSize?: number
      }>
    }

    const { customer, shipping, items } = body

    if (!customer || !shipping || !items || items.length === 0) {
      return errorResponse('Missing required fields: customer, shipping, items')
    }

    const orderId = crypto.randomUUID()
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let orderNum = 'CS-'
    for (let i = 0; i < 5; i++) {
      orderNum += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Calculate subtotal from items
    const itemsSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)

    // Fetch shipping cost from pricing parameters
    const shippingParam = await db
      .prepare("SELECT value FROM pricing_parameters WHERE id = 'shipping_base'")
      .first()
    const shippingCost = shippingParam ? (shippingParam.value as number) : 0

    const total = itemsSubtotal + shippingCost

    // Insert order
    await db
      .prepare(
        `INSERT INTO orders (id, order_number, status, customer_first_name, customer_last_name,
         customer_email, customer_phone, shipping_address1, shipping_address2, shipping_city,
         shipping_state, shipping_zip, shipping_country, subtotal, shipping_cost, total,
         created_at, updated_at)
         VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
      .bind(
        orderId, orderNum,
        customer.firstName, customer.lastName, customer.email, customer.phone,
        shipping.address1, shipping.address2 || '', shipping.city,
        shipping.state, shipping.zip, shipping.country || 'US',
        itemsSubtotal, shippingCost, total
      )
      .run()

    // Insert order items
    for (const item of items) {
      await db
        .prepare(
          `INSERT INTO order_items (order_id, name, type, material_id, material_name,
           thickness, quantity, width, height, services, unit_price, subtotal,
           file_name, file_size)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          orderId, item.name, item.type, item.materialId, item.materialName,
          item.thickness, item.quantity, item.width, item.height,
          JSON.stringify(item.services), item.unitPrice, item.subtotal,
          item.fileName || null, item.fileSize || null
        )
        .run()
    }

    // Fetch the created order with items
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first()
    const { results: orderItems } = await db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .bind(orderId)
      .all()

    const parsedItems = orderItems.map((oi) => ({
      ...oi,
      services: JSON.parse(oi.services as string),
    }))

    return jsonResponse({ ...order, items: parsedItems }, 201)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to create order: ' + message, 500)
  }
}
