import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import tweetRoutes from './routes/tweet';


const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tweets', tweetRoutes)

export default app;