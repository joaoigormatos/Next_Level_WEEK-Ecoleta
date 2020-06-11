import express from 'express'
const routes = express.Router()

import PointsController from './controllers/PointsControllers'
import ItemsController from './controllers/ItemsControllers'
routes.get('/items', ItemsController.index)


routes.post('/points', PointsController.create)
routes.get('/points/:id', PointsController.show)
routes.get('/points', PointsController.index)


export default routes;