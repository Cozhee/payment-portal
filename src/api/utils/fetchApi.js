export async function fetchApi(url, method, payload) {
  const baseUrl = import.meta.env.VITE_APP_HOST;
  if (method.toLowerCase() === "get") {
    try {
      const response = await fetch(baseUrl + url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  } else if (
    method.toLowerCase() === "post" ||
    method.toLowerCase() === "put"
  ) {
    try {
      const response = await fetch(baseUrl + url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  } else {
    // delete
    if (method.toLowerCase() === "del") {
      try {
        const response = await fetch(baseUrl + url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err);
      }
    }
  }
}
