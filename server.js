const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const auth = require('./Controller/auth');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./Routes/users');
const postRouter = require('./Routes/posts');
const app = express();
const PORT = process.env.PORT || 3002
const localENV = dotenv.config().parsed;

mongoose.connect(localENV.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>console.log('Connected to DB'))
.catch((err)=>console.log(err));

app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use('/api/users',userRouter);
app.use('/api/auth',auth.registerRouter);
app.use('/api/auth',auth.signinRouter);
app.use('/api/post',postRouter);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
