import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
dotenv.config();
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
        past_year: {}, // moment or dayjs 써서 현재에서 1년 전  after로 하는게 맞다. (past_year가 one year ago 인지 확실하지 않지만 우선 사용)
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

  // const secpayload = {
  //   database_id,
  //   filter: {
  //     and: [
  //       {
  //         timestamp: 'created_time',
  //         created_time: {
  //           // past_year: {},
  //           after: '2022-11-09',
  //         },
  //       },
  //       {
  //         timestamp: 'created_time',
  //         created_time: {
  //           // past_year: {},
  //           before: '2022-12-09',
  //         },
  //       },
  //     ],
  //   },
  //   sorts: [
  //     // 데이터가 중간에 비어있으면 정렬이 안되는 현상
  //     {
  //       timestamp: 'created_time',
  //       direction: 'ascending',
  //     },
  //   ],
  // };
  // const thirdpayload = {
  //   database_id,
  //   filter: {
  //     and: [
  //       {
  //         timestamp: 'created_time',
  //         created_time: {
  //           // past_year: {},
  //           after: '2022-10-09',
  //         },
  //       },
  //       {
  //         timestamp: 'created_time',
  //         created_time: {
  //           // past_year: {},
  //           before: '2022-11-10',
  //         },
  //       },
  //     ],
  //   },
  //   sorts: [
  //     // 데이터가 중간에 비어있으면 정렬이 안되는 현상
  //     {
  //       timestamp: 'created_time',
  //       direction: 'ascending',
  //     },
  //   ],
  // };
  let dict = {};
  try {
    let queryResult = await notion.databases.query(payload);
    let results = [];
    let next_cur = queryResult['next_cursor'];
    console.log(queryResult, next_cur);
    console.log('---------------');
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
      console.log(queryResult, next_cur);
      console.log('---------------');
      results = [...queryResult['results'], ...results];
      if (!next_cur) {
        break;
      }
    }
    // console.log(results);
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
  console.log(dict['현석 신'].length);
  console.log(dict['가희 정'].length);
  console.log(dict['정현 김'].length);
  // console.log('---------------');
  return dict;
}
