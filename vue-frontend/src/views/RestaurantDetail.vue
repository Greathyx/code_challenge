<template>
  <v-main class="home">
    <v-parallax :src="this.restaurant_detail.photo" style="height: 50vh"></v-parallax>

    <v-row style="margin-top: 30px; padding: 0 20px">
      <v-col cols="6" sm="12" md="6" class="my-col">
        <!-- name -->
        <div class="my-align">
          <h1 class="display-2 font-weight-regular">{{ this.restaurant_detail.name }}</h1>
          <v-avatar tile size="36" style="margin-left: 10px">
            <img :src="this.restaurant_detail.icon" alt="icon">
          </v-avatar>
        </div>

        <!-- rating -->
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

        <!-- location -->
        <div class="my-align" style="height: 35px; margin-top: 20px">
          <v-icon color="secondary" class="align-icon">
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

        <!-- phone number -->
        <div class="my-align" style="height: 35px">
          <v-icon color="secondary" class="align-icon2" size="21">
            mdi-phone-outline
          </v-icon>
          <span class="body-1">{{ this.restaurant_detail.phone_number }}</span>
        </div>

        <!-- website -->
        <div class="my-align" style="height: 35px">
          <v-icon color="secondary" class="align-icon2" size="20">
            mdi-earth
          </v-icon>
          <a :href="this.restaurant_detail.website"
             target="_blank"
             class="my-link"
          >
            <span class="body-1">{{ this.restaurant_detail.website }}</span>
            <v-icon style="vertical-align: baseline; margin-left: 2px"
                    small color="secondary">
              mdi-open-in-new
            </v-icon>
          </a>
        </div>

        <!-- opening hours -->
        <div class="my-align" style="height: 35px">
          <v-icon color="secondary" class="align-icon2" size="21">
            mdi-calendar-outline
          </v-icon>
          <span class="body-1">Opening hours</span>
        </div>
        <div style="margin-left: 27px;">
          <div v-for="item in this.restaurant_detail.opening_hours"
               v-bind:key="item.id" class="body-2" style="margin: 6px 0"
          >
            {{ item }}
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

.my-align {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.align-icon {
  margin-left: -4px;
  margin-right: 8px
}

.align-icon2 {
  margin-left: -2px;
  margin-right: 8px
}
</style>