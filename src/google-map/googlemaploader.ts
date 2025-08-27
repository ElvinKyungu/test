import { Loader } from '@googlemaps/js-api-loader'
import { useMapStore } from '../stores/mapStore'
import { useDark } from '@vueuse/core'

const isDarkMode = useDark()
export const lightModeStyles = [
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f1f1f1"
      },
      {
        "visibility": "off"
      }
    ]
  }
]

export const darkModeStyles = [
{
  featureType: 'water',
  elementType: 'geometry',
  stylers: [
    {
      color: '#191a1a',
    },
  ],
},
{
  featureType: 'landscape',
  elementType: 'geometry',
  stylers: [
    {
      color: '#2b2b2b',
    },
  ],
},
{
  featureType: 'road',
  elementType: 'geometry',
  stylers: [
    {
      color: '#454545',
    },
  ],
},
{
  featureType: 'all',
  elementType: 'labels.text.fill',
  stylers: [
    {
      color: '#c2c2c2',
    },
    {
      weight: 'normal',
    },
  ],
},
{
  featureType: 'all',
  elementType: 'labels.text.stroke',
  stylers: [
    {
      visibility: 'off',
    },
  ],
},
]

export const initializeMap = async()=>{
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly'
  })

  loader.load().then(async () => {
    
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
   
    const map = new Map(document.getElementById('map') as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 4,
      styles: isDarkMode.value ? darkModeStyles : lightModeStyles
    })
    const useMap = useMapStore()
    useMap.setMap(map)
  })
}