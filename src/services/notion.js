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
    filter: {
      timestamp: 'created_time',
      created_time: {
        past_month: {},
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

  const secpayload = {
    database_id,
    filter: {
      and: [
        {
          timestamp: 'created_time',
          created_time: {
            // past_year: {},
            after: '2022-11-09',
          },
        },
        {
          timestamp: 'created_time',
          created_time: {
            // past_year: {},
            before: '2022-12-09',
          },
        },
      ],
    },
    sorts: [
      // 데이터가 중간에 비어있으면 정렬이 안되는 현상
      {
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  };
  const thirdpayload = {
    database_id,
    filter: {
      and: [
        {
          timestamp: 'created_time',
          created_time: {
            // past_year: {},
            after: '2022-10-09',
          },
        },
        {
          timestamp: 'created_time',
          created_time: {
            // past_year: {},
            before: '2022-11-10',
          },
        },
      ],
    },
    sorts: [
      // 데이터가 중간에 비어있으면 정렬이 안되는 현상
      {
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  };
  let dict;
  let dict2;
  let dict3;
  try {
    const { results } = await notion.databases.query(payload); //
    console.log(typeof results);
    dict = {};
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

  try {
    const { results } = await notion.databases.query(secpayload);
    console.log(typeof results);
    dict2 = {};
    results.forEach((page) => {
      if (typeof dict2[page.properties.user.created_by.name] === 'undefined') {
        dict2[page.properties.user.created_by.name] = [];
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
      dict2[page.properties.user.created_by.name].push(filterdUserObj);
    });
  } catch (e) {
    console.log(e);
  }

  try {
    const { results } = await notion.databases.query(thirdpayload);
    console.log(typeof results);
    dict3 = {};
    results.forEach((page) => {
      if (typeof dict3[page.properties.user.created_by.name] === 'undefined') {
        dict3[page.properties.user.created_by.name] = [];
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
      dict3[page.properties.user.created_by.name].push(filterdUserObj);
    });
  } catch (e) {
    console.log(e);
  }
  const dict4 = dict3['현석 신'].concat(dict2['현석 신']);
  console.log(dict4.concat(dict['현석 신']));
  return dict;
}
