import fs from 'fs'
import multer from 'multer'

const storage = multer.diskStorage({
	destination: (_, file, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

export const upload = multer({ storage })
