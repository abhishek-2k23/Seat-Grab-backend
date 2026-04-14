import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export const connectDB = async () => {
    try{
        const client = await pool.connect()
        console.log("DB connection done");
        client.release();
    }catch(err){
        console.log("DB connection failed", err.message);
        process.exit(1);
    }
}

export const query = (text, params) => pool.query(text, params);

export default pool;