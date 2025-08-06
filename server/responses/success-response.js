const successResponseOnApiCall = (data, message = "Success") => {
  return {
    status: 200,
    data,
    count: Array.isArray(data) ? data.length : undefined,
    message
  };
};

module.exports = successResponseOnApiCall;