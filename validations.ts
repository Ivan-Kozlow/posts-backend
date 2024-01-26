import { body } from 'express-validator'

export const registerValidation = [
	body('fullName').isLength({ min: 2 }),
	body('age').isInt({ min: 17 }),
	body('email', 'Аккаунт с такой почтой уже существует').isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
	body('avatarUrl').optional().isURL(),
]

export const loginValidation = [
	body('email', 'Аккаунт с такой почтой уже существует').isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
]

export const postCreateValidation = [
	body('title', 'Слишком короткий заголовок').isLength({ min: 3 }).isString(),
	body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
	body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
