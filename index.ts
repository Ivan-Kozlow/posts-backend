import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

import checkAuth from './src/utils/checkAuth'
import { PORT } from './consts'

import { UserEndpoints } from './src/endpoints/user'
import { TagsEndpoints } from './src/endpoints/tags'
import { PostsEndpoints } from './src/endpoints/posts'
import { upload } from './src/controllers/filesController'

mongoose
	.connect('mongodb+srv://admin:rootroot@cluster0.rzrkjlg.mongodb.net/blog?retryWrites=true&w=majority') // process.env.DB_CONNECTED_URL!
	.then(() => console.log('DB connected OK'))
	.catch((err) => console.log('DB error', err))

const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file?.originalname}`,
	})
})

UserEndpoints(app)
PostsEndpoints(app)
TagsEndpoints(app)

app.listen(PORT, () => console.log(`Server start on ${PORT} port`))

// TODO реализовать сортировку статей с помощью mongoose (в нём есть походящие параметры), популярность определять по просмотрам.
// TODO реализовать блок с тегами
// TODO реализовать комментарии
