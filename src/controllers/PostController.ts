import { Request, Response } from 'express'

import PostModel from '../models/Post'
import { RequestWithUserId } from '../../types'

export const getLastTags = async (_req: Request, res: Response) => {
	try {
		const posts = await PostModel.find().limit(5).exec()
		const tags = posts
			.map((obj, _, arr) => obj.tags)
			.flat()
			.slice(0, 5)
		const tagsNotDuplicate = [...new Set(tags)]
		res.json(tagsNotDuplicate)
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'Не удалось получить теги' })
	}
}

export const create = async (req: RequestWithUserId, res: Response) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(','),
			user: req.userId,
		})

		const post = await doc.save()
		res.status(200).json(post)
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'Не удалось создать статью' })
	}
}

export const getAll = async (req: Request, res: Response) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		res.status(200).json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Не удалось получить статьи' })
	}
}

export const getOne = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id
		const posts = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewCount: 1 } },
			{ returnDocument: 'after' }
		)
			.populate('user')
			.exec()
		res.status(200).json(posts)
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'Не удалось получить статьи' })
	}
}

export const remove = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id
		await PostModel.findOneAndDelete({ _id: postId }).then((doc) => {
			if (!doc) {
				return res.status(400).json({ message: 'Статья не найдена' })
			}
			res.status(200).json({ message: 'Success' })
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Не удалось получить статью' })
	}
}

export const update = async (req: RequestWithUserId, res: Response) => {
	try {
		const postId = req.params.id
		await PostModel.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags.split(','),
				user: req.userId,
			}
		)
		res.json({ message: 'Success' })
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'Не удалось получить статью' })
	}
}
