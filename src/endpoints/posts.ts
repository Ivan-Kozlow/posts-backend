import { Express } from 'express'

import checkAuth from '../utils/checkAuth'

import { PostController } from '../controllers'
import { postCreateValidation } from '../../validations'

export function PostsEndpoints(app: Express) {
	app.get('/posts', PostController.getAll)
	app.get('/posts/:id', PostController.getOne)
	app.get('/posts/tags', PostController.getLastTags)
	app.delete('/posts/:id', checkAuth, PostController.remove)
	app.post('/posts', checkAuth, postCreateValidation, PostController.create)
	app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)
}
