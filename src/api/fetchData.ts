/* eslint-disable @typescript-eslint/no-explicit-any */
const wrapPromise = (promise: Promise<any>) => {
  let status = "pending";
  let response: any;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
};

export const fetchData = (url: string) => {
  const promise = fetch(url)
    .then((res) => res.json())
    .then((res) => res);

  return wrapPromise(promise);
};
