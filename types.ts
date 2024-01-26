import { Request } from 'express'

export interface RequestWithUserId extends Request {
	userId: string
}

declare global {
	namespace Express {
		interface Request {
			userId: string
		}
	}
}
