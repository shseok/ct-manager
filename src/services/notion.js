import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
import dayjs from 'dayjs';
dotenv.config();

const date = dayjs();
const oneYearAgoStr = date.subtract(365, 'day').format('YYYY-MM-DD');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;
export async function getData() {
  const payload = {
    database_id,
    filter: {
      timestamp: 'created_time',
      created_time: {
        after: oneYearAgoStr,
      },
    },
    sorts: [
      // 데이터가 중간에 비어있으면 정렬이 안되는 현상
      {
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  };
  const nextPayload = {
    database_id,
    sorts: [
      // 데이터가 중간에 비어있으면 정렬이 안되는 현상
      {
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  };

  let dict = {};
  try {
    let queryResult = await notion.databases.query(payload);
    let results = [];
    let next_cur = queryResult['next_cursor'];
    results = queryResult['results'];
    while (queryResult.has_more) {
      nextPayload['start_cursor'] = next_cur;
      queryResult = await notion.databases.query(nextPayload);
      next_cur = queryResult['next_cursor'];
      results = [...results, ...queryResult['results']];
      if (!next_cur) {
        break;
      }
    }
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
  } catch (e) {
    console.log(e);
  }
  return dict;
}
