const api_iss = "https://api.wheretheiss.at/v1/satellites/25544";

async function get_iss() {
  const response = await fetch(api_iss);
  const data = await response.json();
  console.log(data);
}

get_iss();
