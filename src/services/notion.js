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
    // sorts: [ // 데이터가 중간에 비어있으면 정렬이 안되는 현상
    //   {
    //     property: 'Date',
    //     direction: 'ascending',
    //   },
    // ],
  };
  const { results } = await notion.databases.query(payload);
  console.log(results);
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
  for (let key in dict) {
    // 단, 유저가 노션에서 date를 모두 입력할 수 있어야한다.
    dict[key].sort(
      (a, b) =>
        parseInt(a['date'].split('-').join('')) -
        parseInt(b['date'].split('-').join(''))
    );
  }
  console.log(dict);
  return dict;
}
