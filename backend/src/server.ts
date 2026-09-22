import 'dotenv/config'
import './model/index.ts'
import app from "./app.ts";
import { connectDatabase } from './function/database.ts';

// Connect to the database
await connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});