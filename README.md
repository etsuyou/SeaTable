# Seatable数据库使用手册

# 手册参考地址

- 中文SeaTable官网：[SeaTable https://cloud.seatable.cn/](https://cloud.seatable.cn/)
- 英文手册参考：[Introduction (seatable.io) https://api.seatable.io/reference/introduction](https://api.seatable.io/reference/introduction)

# 地址替换

<aside>
💡 中文Seatable服务器地址变化

- dtable-web:
    - https://cloud.seatable.cn/
- dtable-server:
    - 一般是https://dtable-server-03.seatable.cn/等
- dtable-db:
    - https://dtable-db.seatable.cn/
    </aside>

# 创建数据库

```jsx
// 引入Database这个类
const Database = require("./Database.js");

// 对MyTest数据库进行可读可写操作的API_TOKEN
const API_TOKEN = '63c6b6ae343fc6c935cc8d0d29055eaf8b0645dd';
let database = new Database(API_TOKEN);
```

# 初始化数据库initSelf()

```jsx
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();
  
  // 从这里开始使用其他方法
  

}

test();
```

# 常用方法

## async getTablesHeader()

```jsx
// async getTablesHeader()
// 测试区开始
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let arr = await database.getTablesHeader();
  console.dir(arr,{depth:null});

}

test();
// 测试区结束
```

```jsx
[
  {
    tableName: 'Table1',
    columns: [
      { name: 'name', type: 'text' },    
      { name: 'password', type: 'text' },
      { name: 'test', type: 'text' }     
    ]
  }
]
```

![image](https://github.com/etsuyou/SeaTable/assets/156873223/4b7a9340-f33e-4f58-b514-b2ac39cd60be)

## async addOneRow(*rowDataObj*, *table_name*)

```jsx
// async addOneRow(rowDataObj, table_name)
// 测试区开始
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let rowDataObj ={
    name:"ceshi",
    password:"ceshi",
    test:"test"
  };
  let table_name = "Table1";
  let res_obj = await database.addOneRow(rowDataObj, table_name);
  console.log(res_obj);
}

test();
// 测试区结束
```

```jsx
{
  rowID: 'A9shNhYqQJy8ELuN2I88Xw',
  createTime: '2024-03-09T07:20:40.902+00:00',
  modifyTime: '2024-03-09T07:20:40.902+00:00',
  obj: { name: 'ceshi', password: 'ceshi', test: 'test' }
}
```

![image](https://github.com/etsuyou/SeaTable/assets/156873223/c2cf571c-d461-4e04-84e5-d9aa7cd0bbfd)

## *async selectRows(sql)*

```jsx
// async selectRows(sql)
// 测试区开始
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let sql = "select * from Table1 where name = 'ceshi' and password = 'ceshi';";
  let arr = await database.selectRows(sql)
  console.log(arr);
}

test();
// 测试区结束
```

```jsx
{
  length: 2,
  arr: [
    {
      name: 'ceshi',
      password: 'ceshi',
      test: 'test',
      _locked: null,
      _locked_by: null,
      _archived: false,
      _creator: null,
      _ctime: '2024-03-09T15:20:40.903+08:00',
      _last_modifier: null,
      _mtime: '2024-03-09T15:20:40.903+08:00',
      _id: 'A9shNhYqQJy8ELuN2I88Xw'
    },
    {
      name: 'ceshi',
      password: 'ceshi',
      test: 'ceshi',
      _locked: null,
      _locked_by: null,
      _archived: false,
      _creator: '048fe97ab93b44d1beea8e2634bbb039@auth.local',
      _ctime: '2024-03-09T15:23:04.088+08:00',
      _last_modifier: '048fe97ab93b44d1beea8e2634bbb039@auth.local',
      _mtime: '2024-03-09T15:23:13.116+08:00',
      _id: 'LfyzpkjjSy6WrGEVoFhVTw'
    }
  ]
}
```

![image](https://github.com/etsuyou/SeaTable/assets/156873223/ac7da71c-a1dc-4393-9ce0-15def6ffdbf4)

## *async updateOneRow(newRowDataObj, rowID, table_name)*

```jsx
// async updateOneRow(newRowDataObj, rowID, table_name)
// 测试区开始
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let newRowDataObj ={
    name:"ceshi_new",
    password:"ceshi_new",
    test:"ceshi_new"
  };
  let rowID = 'LfyzpkjjSy6WrGEVoFhVTw';
  let table_name = "Table1";
  let res = await database.updateOneRow(newRowDataObj, rowID, table_name);
  console.log(res);
}

test();
// 测试区结束
```

```jsx
{ success: true }
```

![image](https://github.com/etsuyou/SeaTable/assets/156873223/a6ad11ca-5705-45fd-9b53-a092d6ceb7c8)

## *async getTableAllRows(table_name)*

```jsx
// getTableAllRows(table_name)
// 测试区开始
async function test(){
	// 使用其他方法之前必须先进行初始化
  await database.initSelf();

  // 从这里开始使用其他方法
  let table_name = "Table1";
  let arr = await database.getTableAllRows(table_name);
  console.log(arr);
}

test();
// 测试区结束
```

```jsx
[
  {
    _id: 'cSIwIoRbRsmHNyFoeiW8HA',
    _mtime: '2024-03-09T02:38:12.214+00:00',
    _ctime: '2024-03-09T02:37:50.046+00:00',
    name: 'zhangsan',
    password: '111'
  },
  {
    _id: 'GIPDuMwKQMKK55S_FQwDdw',
    _mtime: '2024-03-09T03:32:25.043+00:00',
    _ctime: '2024-03-09T02:37:50.046+00:00',
    name: 'lisi',
    password: '222',
    test: '444'
  },
  {
    _id: 'DoBx_PasSU-AFyB7NzoSlQ',
    _mtime: '2024-03-09T03:42:26.242+00:00',
    _ctime: '2024-03-09T03:32:08.899+00:00',
    name: 'lisi_new',
    password: '222_new',
    test: '555_new'
  },
  {
    _id: 'A9shNhYqQJy8ELuN2I88Xw',
    _mtime: '2024-03-09T07:20:40.903+00:00',
    _ctime: '2024-03-09T07:20:40.903+00:00',
    name: 'ceshi',
    password: 'ceshi',
    test: 'test'
  },
  {
    _id: 'LfyzpkjjSy6WrGEVoFhVTw',
    _mtime: '2024-03-09T07:32:53.921+00:00',
    _ctime: '2024-03-09T07:23:04.088+00:00',
    name: 'ceshi_new',
    password: 'ceshi_new',
    test: 'ceshi_new'
  }
]
```

![image](https://github.com/etsuyou/SeaTable/assets/156873223/ee566cdb-f43c-41a6-b4ea-4404545c5457)


