require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    connectDB()
    console.log(`server is running at http://localhost:${PORT}`)
})