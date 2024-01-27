import jwt from 'jsonwebtoken'
import { NextFunction, Response } from 'express'

import { RequestWithUserId } from '../../types'

export default (req: RequestWithUserId, res: Response, next: NextFunction) => {
	console.log(req.headers)
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	if (token) {
		try {
			const decoded = jwt.verify(token, 'jwt-token') as { _id: string }
			req.userId = decoded._id
			next()
		} catch (error) {
			console.log(error)
			res.status(401).json({ massage: 'Нет доступа' })
		}
	} else {
		return res.status(403).json({ message: 'Нет доступа' })
	}
}
