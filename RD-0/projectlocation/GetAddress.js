export function getAddress() {
  const apiKey = process.env.REACT_APP_GOOGlE_APIKEY
  const mapApiJs = "https://maps.googleapis.com/maps/api/js"

  function loadAsyncScript(src) {
    return new Promise(resolve => {
      const script = document.createElement("script")
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src,
      })
      script.addEventListener("load", () => resolve(script))
      document.head.appendChild(script)
    })
  }

  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
      return Promise.resolve()
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`
    return loadAsyncScript(src)
  }
  const geocoder = new google.maps.Geocoder()
  const infowindow = new google.maps.InfoWindow()

  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: 40.731, lng: -73.997 },
    })
    const geocoder = new google.maps.Geocoder()
    const infowindow = new google.maps.InfoWindow()

    geocodeLatLng(geocoder, map, infowindow)

    // document.getElementById("submit").addEventListener("click", () => {
    //   geocodeLatLng(geocoder, map, infowindow)
    // })
  }

  function geocodeLatLng(geocoder, map, infowindow) {
    // const input = document.getElementById("latlng").value
    // const latlngStr = input.split(",", 2)
    const latlng = {
      // lat: parseFloat(latlngStr[0]),
      // lng: parseFloat(latlngStr[1]),
      lat: 40.731,
      lng: -73.997,
    }
  }
  const latlng = {
    // lat: parseFloat(latlngStr[0]),
    // lng: parseFloat(latlngStr[1]),
    lat: 40.731,
    lng: -73.997,
  }

  geocoder.geocode({ location: latlng }).then(response => {
    if (response.results[0]) {
      // map.setZoom(11)

      // const marker = new google.maps.Marker({
      //   position: latlng,
      //   map: map,
      // })

      infowindow.setContent(response.results[0].formatted_address)
      // document.getElementById(
      //   "result"
      // ).innerHTML = `<h1 style="text-align:center;">${response.results[0].formatted_address}</h1>`
    }
  })
  initMapScript().then(() => {
    initMap(data[0][1].ProjectAddress)
  })
}
