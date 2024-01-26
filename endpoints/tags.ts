import { Express } from 'express'

import { PostController } from '../controllers'

export function TagsEndpoints(app: Express) {
	app.get('/tags', PostController.getLastTags)
}
