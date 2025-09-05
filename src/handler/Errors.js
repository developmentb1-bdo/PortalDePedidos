export function HandleError(error) {
  try {
    if (
      Object.hasOwn(error, "response") &&
      Object.hasOwn(error.response, "data")
    ) {
      if (
        Object.hasOwn(error.response.data, "status") &&
        error.response.data.status == 401
      ) {
        return "Sessão inválida ou expirada. Renove a sessão e tente novamente.";
      } else if (Object.hasOwn(error.response.data, "message")) {
        return error.response.data.message;
      } else if (Object.hasOwn(error.response.data, "detail")) {
        try {
          const msg = JSON.parse(error.response.data.detail);
          if (
            Object.hasOwn(msg, "error") &&
            Object.hasOwn(msg.error, "message") &&
            Object.hasOwn(msg.error.message, "value")
          ) {
            return msg.error.message.value;
          } else if (
            Object.hasOwn(msg, "error") &&
            Object.hasOwn(msg.error, "message")
          ) {
            return msg.error.message;
          } else {
            return error.response.data.detail;
          }
        } catch (err) {
          return error.response.data.detail;
        }
      } else if (Object.hasOwn(error.response.data, "error")) {
        if (Object.hasOwn(error.response.data.error, "message")) {
          return error.response.data.error.message;
        }
      } else if (error.response.data) {
        return error.response.data;
      }
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const err = JSON.parse(JSON.stringify(error));
    if (Object.hasOwn(err, "response") && Object.hasOwn(err.response, "data")) {
      if (Object.hasOwn(err.response.data, "message")) {
        return err.response.data.message;
      } else if (Object.hasOwn(err.response.data, "detail")) {
        return err.response.data.detail;
      }
    }
  } catch (err) {
    console.log(err);
  }

  try {
    if (Object.hasOwn(error, "message")) {
      return error.message;
    }
  } catch (err) {
    console.log(err);
  }

  return null;
}
