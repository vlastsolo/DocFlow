import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3020;
app.get('/', (req, res) => {
    res.send({
        message: 'Hello World!'
    });
});
app.listen(PORT, () => {
    console.log('Server is runnig on ${PORT}');
});
//# sourceMappingURL=docflow.js.map