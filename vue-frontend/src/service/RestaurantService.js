import axios from "axios"

const host = "http://localhost:3000";

export default {
    async getRestaurantList() {
        let res = await axios.get(host + "/api/list");
        return res.data;
    },

    async getRestaurantDetail(id) {
        let res = await axios.get(host + "/api/restaurant/" + id);
        return res.data;
    }
}