import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import tweetRoutes from './routes/tweet';
import followRoutes from './routes/follow';
import searchRoutes from './routes/search';



const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tweets', tweetRoutes)
app.use('/followService', followRoutes)
app.use('/search', searchRoutes);


export default app;