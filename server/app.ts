import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import tweetRoutes from './routes/tweet'
import followRoutes from './routes/follow'
import searchRoutes from './routes/search'
import userRoute from './routes/user'



const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tweets', tweetRoutes)
app.use('/followService', followRoutes)
app.use('/search', searchRoutes)
app.use('/user', userRoute)


export default app;