import Knex from 'knex'

export async function up(Knex: Knex) {
  // go
  return Knex.schema.createTable('points', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('whatsapp').notNullable()
    table.decimal('latitude').notNullable()
    table.decimal('longitude').notNullable()
    table.string('city').notNullable()
    table.string('uf').notNullable()

  })

}


export async function down(Knex: Knex) {
  // go back
  return Knex.schema.dropTable('points')
}