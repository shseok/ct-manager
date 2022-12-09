import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
dotenv.config();
// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;

export async function getData() {
  const payload = {
    database_id,
    method: 'POST',
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
  };
  const { results } = await notion.databases.query(payload);
  const dict = {};
  results.forEach((page) => {
    if (typeof dict[page.properties.user.created_by.name] === 'undefined') {
      dict[page.properties.user.created_by.name] = [];
    }
    const filterdUserObj = {
      id: page.id,
      user: page.properties.user.created_by.name,
      tags:
        page.properties.Tags.multi_select.length === 0
          ? 'not found'
          : page.properties.Tags.multi_select[0].name,
      date: page.properties.Date.date?.start,
    };
    dict[page.properties.user.created_by.name].push(filterdUserObj);
  });
  return dict;
}
