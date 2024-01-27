import { Express } from 'express'

import checkAuth from '../utils/checkAuth'

import { UserController } from '../controllers'
import { loginValidation, registerValidation } from '../../validations'

export function UserEndpoints(app: Express) {
	app.post('/auth/login', loginValidation, UserController.login)
	app.post('/auth/register', registerValidation, UserController.register)
	app.get('/auth/me', checkAuth, UserController.getMe)
}
