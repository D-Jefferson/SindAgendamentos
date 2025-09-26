import axios from "axios";

export const api = axios.create({
  baseURL: "https://sindrg-fca7a0fshugfgdar.brazilsouth-01.azurewebsites.net/api",
  headers: { "Content-Type": "application/json" }
});
