const Header = require('./header');

/**
 * @param {Object} res - res物件
 * @param {Array} todos - todolist
 */
function successHandle(res, data) {
  res.writeHead(200, Header);
  res.write(
    JSON.stringify({
      status: 'success',
      data
    })
  );
  res.end();
}

/**
 * @param {Object} res res物件
 * @param {string} errorMessage 錯誤訊息
 * @param {number} errorCode http status code
 */
const errorHandle = (res, errorMessage, errorCode = 400) => {
  res.writeHead(errorCode, Header);
  res.write(
    JSON.stringify({
      status: 'false',
      message: errorMessage
    })
  );
  res.end();
};

module.exports = {
  Header,
  successHandle,
  errorHandle,
};