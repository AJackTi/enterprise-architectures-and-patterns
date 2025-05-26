import * as Variables from "@spinframework/spin-variables";

const withConfig = (request) => {
  request.config = {
    dbConnectionString: Variables.get("db_connection_string"),
  };
};

export { withConfig };
