export const RequestMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

export const FetchRequest = (url, method, payload, headers?) => {
    const options = {
        method: RequestMethod[method],
        body: JSON.stringify({...payload}),
        headers: headers ? { 'content-type': 'application/json; charset=utf-8' } : []
      };
    return fetch(url, options);
};