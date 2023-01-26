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
  let payload = {
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

  let dict = {};
  try {
    let queryResult = await notion.databases.query(payload);
    let results = [];
    let next_cur = queryResult['next_cursor'];
    results = queryResult['results'];
    // console.log(queryResult['results'].map((each) => each.created_time));
    // console.log('---------------');
    while (queryResult.has_more) {
      // payload['start_cursor'] = next_cur;
      queryResult = await notion.databases.query({
        database_id,
        start_cursor: next_cur,
        sorts: [
          // 데이터가 중간에 비어있으면 정렬이 안되는 현상
          {
            timestamp: 'created_time',
            direction: 'ascending',
          },
        ],
      });
      next_cur = queryResult['next_cursor'];
      // console.log(queryResult['results'].map((each) => each.created_time));
      // console.log('---------------');
      results = [...results, ...queryResult['results']];
      if (!next_cur) {
        break;
      }
    }
    // console.log(results.map((each) => each.created_time));
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
  console.log(dict['현석 신'].map((each) => each.date));
  console.log(
    // dict['현석 신'].map((each) => each.date),
    dict['현석 신'].length
  );
  console.log(
    // dict['현석 신'].map((each) => each.date),
    dict['정현 김'].length
  );
  console.log(
    // dict['현석 신'].map((each) => each.date),
    dict['가희 정'].length
  );
  return dict;
}
