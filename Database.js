class Database {
  // 两种方式构造类：一个参数或者两个参数
  // 一个参数传入API_Toten
  // 两个参数传入SeaTableUserLoginName和SeaTableUserLoginPassword
  constructor(...args) {
    // 不同参数调用不同的构造函数
    if (args.length === 1) {
      // 使用一个API_Toten创建类
      this.constructDatabaseWithOneArg(args[0]);
    } else if (args.length === 2) {
      // 使用SeaTable账号密码创建类，不推荐！！！
      this.constructDatabaseWithTwoArgs(args[0], args[1]);
    } else {
      // 不应该进入这里
      // 进入这里应该立马报错
      throw new Error("Invalid number of arguments.");
    }
  }
  // 具体实现的构造函数
  constructDatabaseWithOneArg(arg1) {
    // 使用一个API_Toten创建类
    this.API_Toten = arg1;
  }
  constructDatabaseWithTwoArgs(arg1, arg2) {
    // 使用SeaTable账号密码创建类，不推荐！！！
    this.SeaTableUserLoginName = arg1;
    this.SeaTableUserLoginPassword = arg2;
  }

  // 重写toString方法，打印对象的时候用
  // 但我还没想好要返回什么，先留着
  toString() {
    return "Hello world";
  }

  // 获得必要参数并将其加到对象的属性中，同时返回一个包含这些数据的对象
  async initSelf() {
    return new Promise((resolve, reject) => {
      // 执行任何方法之前都必须要init
      // 因此，如果没有init即没有API_Toten则应报错
      if (this.API_Toten) {
        // 请求信息
        const msg = {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: "Bearer " + this.API_Toten,
          },
        };
        fetch(
          "https://cloud.seatable.cn/api/v2.1/dtable/app-access-token/",
          msg
        )
          .then((response) => response.json())
          .then((response) => {
            // 常用信息
            this.databaseAccessToken = response.access_token;
            this.databaseUUID = response.dtable_uuid;
            this.databaseServerAddr = response.dtable_server;
            this.databseAddr = response.dtable_db;
            // 几乎不用的信息
            this.API_Toten_name = response.app_name;
            this.databaseName = response.dtable_name;
            this.workspace_id = response.workspace_id;
            this.databaseSocketAddr = response.dtable_socket;

            // 将这些数据放到对象属性之后返回一份Promise
            // Promise中包含刚才添加的数据
            resolve({
              // 常用信息
              databaseAccessToken: this.databaseAccessToken,
              databaseUUID: this.databaseUUID,
              databaseServerAddr: this.databaseServerAddr,
              databseAddr: this.databseAddr,
              // 几乎不用的信息
              API_Toten_name: this.API_Toten_name,
              databaseName: this.databaseName,
              workspace_id: this.workspace_id,
              databaseSocketAddr: this.databaseSocketAddr,
            });
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("initSelf函数错误."));
      }
    });
  }

  async getTablesHeader() {
    return new Promise((resolve, reject) => {
      if (
        this.API_Toten &&
        this.databaseAccessToken &&
        this.databaseServerAddr &&
        this.databaseUUID
      ) {
        const msg = {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
        };
        fetch(
          this.databaseServerAddr +
            "api/v1/dtables/" +
            this.databaseUUID +
            "/metadata/",
          msg
        )
          .then((response) => response.json())
          .then((response) => {
            // 返回表头信息的数组
            let arr = [];
            for (let i = 0; i < response.metadata.tables.length; i++) {
              const data = response.metadata.tables[i];
              const tableName = data.name;
              const columns = data.columns.map((item) => {
                return {
                  name: item.name,
                  type: item.type,
                };
              });
              arr.push({ tableName, columns });
            }
            // console.dir(arr,{depth:null});
            resolve(arr);
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("getTablesHeader函数错误."));
      }
    });
  }

  async addOneRow(rowDataObj, table_name) {
    return new Promise((resolve, reject) => {
      if (
        this.databaseAccessToken &&
        this.databaseServerAddr &&
        this.databaseUUID &&
        rowDataObj &&
        table_name
      ) {
        const msg = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
          body: JSON.stringify({ row: rowDataObj, table_name: table_name }),
        };

        fetch(
          this.databaseServerAddr +
            "api/v1/dtables/" +
            this.databaseUUID +
            "/rows/",
          msg
        )
          .then((response) => response.json())
          .then((response) => {
            const obj = {
              rowID: response._id,
              createTime: response._ctime,
              modifyTime: response._mtime,
              obj: rowDataObj,
            };
            resolve(obj);
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("addOneRow函数错误."));
      }
    });
  }

  async selectRows(sql) {
    return new Promise((resolve, reject) => {
      if (
        this.databaseAccessToken &&
        this.databseAddr &&
        this.databaseUUID &&
        sql
      ) {
        // SQL查找数据
        const msg = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
          body: JSON.stringify({ convert_keys: true, sql: sql }),
        };

        fetch(this.databseAddr + "api/v1/query/" + this.databaseUUID + "/", msg)
          .then((response) => response.json())
          .then((response) => {
            // console.log(response);
            let arr = [];
            // sql可以查出来很多个，把这些数据依次放进arr中准备返回
            for (let i = 0; i < response.results.length; i++) {
              arr.push(response.results[i]);
            }
            resolve({
              length: response.results.length,
              arr: arr,
            });
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("selectRows函数错误."));
      }
    });
  }

  async updateOneRow(newRowDataObj, rowID, table_name) {
    return new Promise((resolve, reject) => {
      if (
        this.databaseAccessToken &&
        this.databaseServerAddr &&
        this.databaseUUID &&
        newRowDataObj &&
        rowID &&
        table_name
      ) {
        const msg = {
          method: "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
          body: JSON.stringify({
            row: newRowDataObj,
            row_id: rowID,
            table_name: table_name,
          }),
        };

        fetch(
          this.databaseServerAddr +
            "api/v1/dtables/" +
            this.databaseUUID +
            "/rows/",
          msg
        )
          .then((response) => response.json())
          .then((response) => {
            // console.log(response);
            resolve(response);
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("updateOneRow函数错误."));
      }
    });
  }

  async getTableAllRows(table_name) {
    return new Promise((resolve, reject) => {
      if (
        this.databaseAccessToken &&
        this.databaseServerAddr &&
        this.databaseUUID &&
        table_name
      ) {
        const msg = {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
        };

        fetch(
          this.databaseServerAddr +
            "api/v1/dtables/" +
            this.databaseUUID +
            "/rows/?table_name=" +
            table_name,
          // &order_by={orderID}
          // &direction={asc/desc}
          // &start=1 //从第二个元素开始，默认0是从第一个开始
          // &limit=2 //每次返回的个数

          msg
        )
          .then((response) => response.json())
          .then((response) => {
            resolve(response.rows);
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("getTableAllRows函数错误."));
      }
    });
  }
  // 从这里开始继续写方法
  async deleteOneRow(table_name, rowID) {
    return new Promise((resolve, reject) => {
      if (
        this.databaseAccessToken &&
        this.databaseServerAddr &&
        this.databaseUUID &&
        table_name &&
        rowID
      ) {
        const msg = {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer " + this.databaseAccessToken,
          },
          body: JSON.stringify({ table_name: table_name, row_id: rowID }),
        };

        fetch(
          this.databaseServerAddr +
            "api/v1/dtables/" +
            this.databaseUUID +
            "/rows/",
          msg
        )
          .then((response) => response.json())
          .then((response) => {
            resolve(response);
          })
          .catch((err) => console.error(err));
      } else {
        reject(new Error("deleteOneRow函数错误."));
      }
    });
  }
}
// 类定义到这里结束

// 测试区域开始

// 测试区域结束

// 导出区域开始
module.exports = Database;

// 导出区域结束
