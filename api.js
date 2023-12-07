async function getData() {
  const url = "https://nerdy-pickup-lines1.p.rapidapi.com/pickup_lines/random";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "10636befecmshf12d9d703be1996p1e7855jsn579b30708327",
      "X-RapidAPI-Host": "nerdy-pickup-lines1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    let pickupLine = result.random_pickup_line;
    // console.log(pickupLine);

    let pickupLineEl = document.querySelector("#pickupLine");
    pickupLineEl.textContent = pickupLine;
  } catch (error) {
    console.error(error);
  }
}

getData();
