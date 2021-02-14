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
        </v-col>
      </v-row>
    </v-parallax>

    <div class="my-container">
      <v-row style="margin: 0px 60px 40px 60px">
        <v-col v-for="item in restaurantData.slice((page - 1) * 12, page * 12)"
               v-bind:key="item.id" cols="3" md="3" sm="6" style="height: 440px">
          <v-card
              class="mx-auto my-12"
              max-width="374"
          >
            <v-img height="250" :src="item.photo"></v-img>

            <v-card-title>
              {{ item.name.length > 24 ? item.name.substring(0, 22) + "..." : item.name }}
            </v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
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

              <div class="my-4 subtitle-1">$ • Italian, Cafe</div>
<!--              <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>-->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-pagination
          v-model="page"
          :length=pageLength
          :total-visible="7"
          style="margin-bottom: 30px"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import RestaurantService from "@/service/RestaurantService";

export default {
  name: 'Home',

  components: {},

  created() {
    Promise.resolve(RestaurantService.getRestaurantList()).then((result) => {
      this.restaurantData = result;
      // calculate page length
      this.pageLength = this.restaurantData.length % 12 === 0 ?
          this.restaurantData.length / 12 : this.restaurantData.length / 12 + 1
    })
  },

  data: () => ({
    page: 1,
    restaurantData: {},
    pageLength: 4  // default page length
  }),
}
</script>

<style>
.my-container {
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>