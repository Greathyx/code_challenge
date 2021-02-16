<template>
  <div class="home">
    <v-parallax src="@/assets/parallax.jpg" style="height: 100vh">
      <v-row
          align="center"
          justify="center"
      >
        <v-col class="text-center" cols="12">
          <h1 class="font-weight-bold display-4">Viaplay Lunchbot</h1>
          <h4 class="font-weight-medium headline"
              style="margin-top: 20px">
            Discover your favourite restaurants here!
          </h4>
          <div style="display: flex; justify-content: center;
                  padding: 0 50px; margin-top: 25px">
            <v-text-field
                placeholder="Search for a restaurant"
                prepend-inner-icon="mdi-magnify"
                filled dense clearable
                background-color="white" color="secondary"
                style="border-radius: 10px; max-width: 520px; min-width: 300px"
                class="expanding-search"
                v-model="search_content"
                @keyup.enter="onSearch"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-parallax>

    <div class="my-container">
      <v-row style="margin: 20px 60px 40px 60px">
        <v-col class="d-flex" cols="12" style="display: flex; flex-direction: row; align-items: center">
          <h3 class="font-weight-medium">Sorted by: </h3>

          <v-btn
              small
              :outlined="this.sort_type !== 'original'"
              color="secondary"
              class="ma-2 white--text"
              @click="sortRestaurants('original')"
          >
            Original
            <v-icon right dark>
              mdi-sort-variant
            </v-icon>
          </v-btn>

          <v-btn
              small
              :outlined = "this.sort_type === 'original'"
              color="secondary"
              class="ma-2 white--text"
              @click="sortRestaurants('rating')"
          >
            Rating
            <v-icon right dark>
              {{this.rating_type === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'}}
            </v-icon>
          </v-btn>
        </v-col>

        <v-col v-for="item in restaurantData.slice((page - 1) * 12, page * 12)"
               v-bind:key="item.id" cols="12" md="3" sm="6"
               style="height: 420px; margin-top: -30px">
          <v-card
              class="mx-auto my-12"
              max-width="374"
              hover
              v-on:click="openDetail(item.id)"
          >
            <v-img height="250" :src="item.photo"></v-img>

            <v-card-title>
              {{ item.name.length > 24 ? item.name.substring(0, 22) + "..." : item.name }}
            </v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0" style="margin-bottom: 10px">
                <v-rating
                    :value="item.rating"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                ></v-rating>
                <div class="grey--text ml-4">{{ item.rating }}</div>
              </v-row>
<!--              <div class="my-4 subtitle-1">$ • Italian, Cafe</div>-->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-pagination
          v-model="page"
          :length="this.pageLength || 4"
          :total-visible="7"
          style="margin-bottom: 30px"
      ></v-pagination>
    </div>

    <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        light top
    >
      Don't forget to type in the content that you want to search ^_^
    </v-snackbar>

    <v-snackbar
        v-model="snackbar2"
        :timeout="2000"
        light top
    >
      Sorry, no matched result is found T^T
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import RestaurantService from "@/service/RestaurantService";

export default {
  name: 'Home',

  created() {
    Promise.resolve(RestaurantService.getRestaurantList()).then((result) => {
      this.restaurantData = result;
      this.totalDataSize = result.length;
      // calculate the page length
      this.updatePageLength();
    })
  },

  data: () => ({
    page: 1,
    restaurantData: [],
    totalDataSize: null,
    pageLength: 4,  // default page length
    sort_type: 'original',
    rating_type: 'asc',
    search_content: '',
    snackbar: false,
    snackbar2: false,
  }),

  watch: {
    // eslint-disable-next-line no-unused-vars
    search_content: function (newVal, oldVal) {
      if (newVal === null && oldVal !== null) {
        if (this.restaurantData.length !== this.totalDataSize) {
          Promise.resolve(RestaurantService.getRestaurantList()).then((result) => {
            this.restaurantData = result;
            this.updatePageLength();
          })
        }
      }
    }
  },

  methods: {
    updatePageLength() {
      this.pageLength = Math.ceil(this.restaurantData.length / 12)
    },

    sortRestaurants(new_sort_type) {
      if (new_sort_type === 'rating') {
        if (this.sort_type !== 'original')
          this.rating_type = (this.rating_type === 'asc' ? 'desc' : 'asc');
      }
      this.sort_type = new_sort_type;

      switch (this.sort_type) {
        case 'original':
          Promise.resolve(RestaurantService.getRestaurantList()).then((result) => {
            this.restaurantData = result;
            this.updatePageLength();
          })
          break;
        case 'rating':
          if (this.rating_type === 'asc') {
            this.restaurantData.sort(function (a, b) {
              return b.rating - a.rating;
            })
          } else {
            this.restaurantData.sort(function (a, b) {
              return a.rating - b.rating;
            })
          }
          break;
        default:
          break;
      }
    },

    openDetail(restaurant_id) {
      this.$router.push({path: '/restaurant_detail', query: {id: restaurant_id}});
    },

    onSearch() {
      if (this.search_content === '')
        this.snackbar = true;
      else {
        let matchedRestaurant = [];

        for (const index in this.restaurantData) {
          const search_content_lowCase = this.search_content.toLowerCase();
          const restaurant_name = this.restaurantData[parseInt(index)].name.toLowerCase();

          if (restaurant_name.includes(search_content_lowCase))
            matchedRestaurant.push(this.restaurantData[parseInt(index)])
        }

        if (matchedRestaurant.length === 0)
          this.snackbar2 = true;
        else {
          this.restaurantData = matchedRestaurant;
          this.updatePageLength();
        }
      }
    }
  }
}
</script>

<style lang="sass">
.my-container
  width: 100%
  padding: 0
  margin: 0

.expanding-search
  .v-input__slot
    &:before, &:after
      content: none !important
</style>