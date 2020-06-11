import Knex from "knex";

export async function seed(Knex: Knex) {
  return await Knex('items').insert([
    { title: "Lâmpadas", image: "lampadas.svg" },
    { title: "Pilhas e Baterias", image: "baterias.svg" },
    { title: "Papéis e Papelão", image: "papeis-papelao.svg" },
    { title: "Resíduos Orgânicos", image: "organicos.svg" },
    { title: "Óleo de Cozinha", image: "oleo.svg" },
    { title: "Eletronicos", image: "eletronicos.svg" }
  ])
}