import Knex from 'knex'

export async function up(Knex: Knex) {
  // go
  return Knex.schema.createTable('points_items', table => {
    table.increments('id').primary()
    table.string('point_id').notNullable().references('id').inTable('points')
    table.string('item_id').notNullable().references('id').inTable('items')
  })

}


export async function down(Knex: Knex) {
  // go back
  return Knex.schema.dropTable('points_items')
}