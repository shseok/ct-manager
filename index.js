const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')

// Initializing a client
const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

const database_id = process.env.NOTION_DATABASE_ID

const getData = async ()=>{
    const payload = {
        database_id,
        method: 'POST',
    }
    const {results} = await notion.databases.query(payload);
    console.log(results);
}
getData();
