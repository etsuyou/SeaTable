const crypto = require("crypto");

// 生成盐值
function generateSalt(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

// 生成加盐哈希
function hashPassword(password, salt) {
  var hash = crypto.createHmac("sha512", salt); // 使用SHA-512
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
}

// 创建加盐哈希密码
// 用户侧使用这个函数产生哈希后的密码串
function saltHashPassword(userpassword) {
  var salt = generateSalt(16); // 给定盐值长度
  var passwordData = hashPassword(userpassword, salt);
  return {
    UserPassword: userpassword,
    Salt: passwordData.salt,
    PasswordHash: passwordData.passwordHash,
  };
}

// 产生哈希串
// let myPassword = "myP@ssw0rd";
// let obj = saltHashPassword(myPassword);
// console.log(obj);
// 例如得到以下对象，注意：每次获得的盐不一样，计算所得哈希串也不一样
// {
//   UserPassword: 'myP@ssw0rd',
//   Salt: '450b9a2391c0ece3',
//   PasswordHash: '8aac48d7b2e8b5c69e5dc86c620d149c60c7049ed88a67d9d847037f62534fbd7c925ea61c43e660a3b34a4769c4dae174dc632aaae9f5e0241cd852dc8fcf48'
// }

// 验证哈希串
let UserPassword = "myP@ssw0rd";
let Salt = "450b9a2391c0ece3";
console.log(hashPassword(UserPassword, Salt));
// 对比数据库里的
// PasswordHash='8aac48d7b2e8b5c69e5dc86c620d149c60c7049ed88a67d9d847037f62534fbd7c925ea61c43e660a3b34a4769c4dae174dc632aaae9f5e0241cd852dc8fcf48'
