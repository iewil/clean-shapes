import { jsonResponse, errorResponse, type CFContext } from '../../env'

export async function onRequestGet(context: CFContext) {
  const db = context.env.DB

  try {
    const { results: materials } = await db
      .prepare('SELECT * FROM materials WHERE active = 1 ORDER BY sort_order')
      .all()

    const materialsWithThicknesses = await Promise.all(
      materials.map(async (material) => {
        const { results: thicknesses } = await db
          .prepare(
            'SELECT * FROM thicknesses WHERE material_id = ? AND active = 1 ORDER BY sort_order'
          )
          .bind(material.id)
          .all()

        return { ...material, thicknesses }
      })
    )

    return jsonResponse(materialsWithThicknesses)
  } catch (err) {
    const message = (err as Error).message
    return errorResponse('Failed to fetch materials: ' + message, 500)
  }
}
