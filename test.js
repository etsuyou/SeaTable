// 引入Database这个类
const Database = require("./Database.js");

// 对MyTest数据库进行可读可写操作的API_TOKEN
const API_TOKEN = "63c6b6ae343fc6c935cc8d0d29055eaf8b0645dd";
let database = new Database(API_TOKEN);

// async deleteOneRow(table_name, rowID)
// 测试区开始
async function test() {
  // 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let table_name = "Table1";
  let arr = await database.getTableAllRows(table_name);
  console.log(arr);

  let to_delete_row_id = "O_P4clTOQpGC9OPrR8HJ-w";
  let res = await database.deleteOneRow(table_name, to_delete_row_id);
  console.log(res);
}

test();
// 测试区结束
