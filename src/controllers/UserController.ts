import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import UserModel from '../models/User'
import { RequestWithUserId } from '../../types'

export const login = async (req: Request, res: Response) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(401).json({ message: 'User not found' })
		}
		const isValidPassword = await bcrypt.compare(req.body.password, user.passwordHash)
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Неверный логин или пароль' })
		}

		// successful login
		const token = jwt.sign({ _id: user._id }, 'jwt-token', { expiresIn: '30d' })
		const { passwordHash, ...userData } = user.toObject()
		res.json({ ...userData, token })
	} catch (err) {
		console.log(err)
		res.status(401).json({ message: 'Не удалось авторизоваться' })
	}
}

export const register = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		// Hashed password
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			fullName: req.body.fullName,
			passwordHash: hash,
			age: req.body.age,
			email: req.body.email,
			avatarUrl: req.body.avatar,
		})

		const user = await doc.save()
		const token = jwt.sign({ _id: user._id }, 'jwt-token', { expiresIn: '30d' })

		const { passwordHash, ...userData } = user.toObject()

		res.json({ ...userData, token })
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Ошибка на стороне сервера' })
	}
}

export const getMe = async (req: RequestWithUserId, res: Response) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(400).json({ message: 'Отказано в доступе' })
		}

		const { passwordHash, ...userData } = user.toObject()
		res.status(200).json(userData)
	} catch (error) {
		console.log(error)
		res.status(401).json({ message: 'Нет доступа' })
	}
}
