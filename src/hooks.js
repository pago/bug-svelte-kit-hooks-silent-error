import cookie from "cookie";
import { v4 as uuid } from "@lukeed/uuid";
/// REMOVE THIS LINE to make the file work again
import fs from "fs/promises";

console.log(">>> HOOKS RUNNING");

export const getContext = (request) => {
  console.log(">>> getContext");
  const cookies = cookie.parse(request.headers.cookie || "");

  return {
    is_new: !cookies.userid,
    userid: cookies.userid || uuid(),
  };
};

export const handle = async ({ request, render }) => {
  // TODO https://github.com/sveltejs/kit/issues/1046
  const response = await render({
    ...request,
    method: (request.query.get("_method") || request.method).toUpperCase(),
  });

  const { is_new, userid } = request.context;

  if (is_new) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    return {
      ...response,
      headers: {
        ...response.headers,
        "set-cookie": `userid=${userid}; Path=/; HttpOnly`,
      },
    };
  }

  return response;
};
