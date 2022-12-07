const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

module.exports = async function getData(){
        const payload = {
            database_id,
            method: 'POST',
        }
        const {results} = await notion.databases.query(payload);
        return results.map(page => {
            return {
                id: page.id,
                user: page.properties.user.created_by.name,
                tags: page.properties.Tags.multi_select.length === 0 ? 'not found' : page.properties.Tags.multi_select[0].name,
                date: page.properties.Date.date?.start,
            };
        });
    }