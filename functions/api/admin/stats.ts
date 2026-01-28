import { jsonResponse, errorResponse, type CFContext } from '../../env'

export async function onRequestGet(context: CFContext) {
  const db = context.env.DB

  try {
    // Total orders
    const totalResult = await db
      .prepare('SELECT COUNT(*) as count FROM orders')
      .first()
    const totalOrders = totalResult ? (totalResult.count as number) : 0

    // Orders by status
    const { results: statusRows } = await db
      .prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status')
      .all()
    const ordersByStatus: Record<string, number> = {}
    for (const row of statusRows) {
      ordersByStatus[row.status as string] = row.count as number
    }

    // Revenue (excluding cancelled)
    const revenueResult = await db
      .prepare("SELECT SUM(total) as revenue FROM orders WHERE status NOT IN ('cancelled')")
      .first()
    const totalRevenue = revenueResult ? (revenueResult.revenue as number) || 0 : 0

    // Active materials count
    const materialsResult = await db
      .prepare('SELECT COUNT(*) as count FROM materials WHERE active = 1')
      .first()
    const activeMaterials = materialsResult ? (materialsResult.count as number) : 0

    // Recent orders
    const { results: recentOrders } = await db
      .prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5')
      .all()

    return jsonResponse({
      totalOrders,
      ordersByStatus,
      totalRevenue,
      activeMaterials,
      recentOrders,
    })
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to fetch stats: ' + message, 500)
  }
}
