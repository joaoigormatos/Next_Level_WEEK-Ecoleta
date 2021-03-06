import { Request, Response } from 'express'

import knex from '../database/connection'

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        img_url: 'http://192.168.2.6:3880/uploads/' + item.image
      }
    })

    return res.json(serializedItems)
  }
}

export default new ItemsController();