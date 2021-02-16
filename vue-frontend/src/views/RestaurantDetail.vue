<template>
  <v-main class="home">
    <v-parallax :src="this.restaurant_detail.photo" style="height: 50vh"></v-parallax>

    <v-row style="margin-top: 30px; padding: 0 20px">
      <v-col cols="6" sm="12" md="6" class="my-col">
        <div style="width: 80%">
          <h1 class="display-2 font-weight-regular">{{ this.restaurant_detail.name }}</h1>
          <v-row align="center" class="mx-0" style="margin-top: 10px">
            <v-rating
                :value="this.restaurant_detail.rating"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
            ></v-rating>
            <div class="grey--text ml-4">{{ this.restaurant_detail.rating }}</div>
          </v-row>

          <div style="display: flex; flex-direction: row; align-items: center; margin-top: 20px">
            <v-icon
                color="secondary"
                style="margin-left: -4px; margin-right: 4px"
            >
              mdi-map-marker-outline
            </v-icon>
            <a :href="this.restaurant_detail.google_maps_url"
               target="_blank"
               class="my-link"
            >
              <span class="body-1">{{ this.restaurant_detail.address }}</span>
              <v-icon style="vertical-align: baseline; margin-left: 2px"
                      small color="secondary">
                mdi-open-in-new
              </v-icon>
            </a>
          </div>
        </div>
      </v-col>

      <v-col cols="6" sm="12" md="6" class="my-col">
        <!--In the following div the HERE Map will render-->
        <div
            id="mapContainer"
            style="height: 360px; width: 100%; cursor: grab"
            ref="hereMap"
        ></div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import RestaurantService from "@/service/RestaurantService";

export default {
  name: "RestaurantDetail",

  data() {
    return {
      platform: null,
      // Get the API KEY from developer.here.com
      apikey: "CNdCGtP5YyP5ccFI955RBn-5DWLlMQo2wAUXt5FGjiU",
      center: {
        lat: null,
        lng: null,
      },
      restaurant_detail: {},
    };
  },

  async mounted() {
    const result = await Promise.resolve(RestaurantService.getRestaurantDetail(this.$route.query.id));
    this.restaurant_detail = result;
    this.center = {
      lat: result.location.lat,
      lng: result.location.lng,
    }
    // Initialize the platform object:
    this.platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.initializeHereMap();
  },

  methods: {
    initializeHereMap() { // rendering map
      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      var map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 15,
        center: this.center
      });

      addEventListener("resize", () => map.getViewPort().resize());
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));  // add behavior control
      H.ui.UI.createDefault(map, maptypes);  // add UI
    }
  }

}
</script>

<style scoped>
.my-col {
  padding: 20px 60px;
}

.my-link {
  text-decoration: none;
  color: #212121
}

.my-link:hover {
  text-decoration: underline;
}
</style>