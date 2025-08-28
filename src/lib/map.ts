import type { UserDeviceData } from '../types'
import { format } from 'date-fns'

let markers: google.maps.Marker[] = []

// Function to set the map on all markers.
function setMapOnAll(map: google.maps.Map | null) {
  markers.forEach(marker => marker.setMap(map))
}

// Removes the markers from the map, but keeps them in the array.
export function hideMarkers(): void {
  setMapOnAll(null)
}

// Deletes all markers in the array by removing references to them.
export function deleteMarkers(): void {
  hideMarkers()
  markers = []
}

// Displays the markers on the map based on `UserDeviceData[]`.
export const createAndDisplayDevicesPositions = async (data: UserDeviceData[], map: google.maps.Map) => {
  if (!data.length) {
    console.error('No device data available.')
    return
  }

  const myLatLng = { device_latitude: data[0].last_latitude, device_longitude: data[0].last_longitude }
  zoomAndCenterMap(map, myLatLng, 3)
  createMarker(map, data)
}

export const zoomAndCenterMap = (map: google.maps.Map, coord: { device_latitude: number; device_longitude: number }, zoomLevel = 10) => {
  map.setCenter(new google.maps.LatLng(coord.device_latitude, coord.device_longitude))
  map.setZoom(zoomLevel)
}

// Groups device data by device ID.
export const groupByDeviceId = (data: UserDeviceData[]): Record<string, UserDeviceData[]> => {
  return data.reduce((acc, curr) => {
    const { id } = curr
    if (!acc[id]) {
      acc[id] = []
    }
    acc[id].push(curr)
    return acc
  }, {} as Record<string, UserDeviceData[]>)
}

// Create markers for each device on the map.
export const createMarker = (map: google.maps.Map, data: UserDeviceData[]) => {
  data.forEach(deviceData => {
    const myLatLng = { lat: deviceData.last_latitude, lng: deviceData.last_longitude }
    const marker = new google.maps.Marker({
      position: myLatLng,
      map,
      title: deviceData.id.toString(),
    })
    markers.push(marker)

    const formattedDate = deviceData.last_report_date
      ? format(new Date(deviceData.last_report_date), 'yyyy-MM-dd HH:mm:ss')
      : 'No data'

    const infoWindowContent = `
      <ul style="color:black; display: grid; gap:.5rem;">
        <li><b>Company name</b>: ${deviceData.company_name || 'No data'}</li>
        <li><b>Project name</b>: ${deviceData.division_name || 'No data'}</li>
        <li><b>Device name</b>: ${deviceData.device_name || 'No data'}</li>
        <li><b>Temperature</b>: ${deviceData.last_temperature || 'No data'}</li>
        <li><b>Last update</b>: ${formattedDate}</li>
        <li><b>Battery Level</b>: ${deviceData.last_battery_level ? `${deviceData.last_battery_level}%` : 'No data'}</li>
      </ul>
    `
    addPopin(map, marker, infoWindowContent)
  })
}

let activeInfoWindow: google.maps.InfoWindow | null = null

export const addPopin = (map: google.maps.Map, marker: google.maps.Marker, content: string) => {
  const infowindow = new google.maps.InfoWindow({ content })

  marker.addListener('click', () => {
    if (activeInfoWindow) {
      activeInfoWindow.close()
    }

    infowindow.open({ anchor: marker, map, shouldFocus: true })

    activeInfoWindow = infowindow

    map.addListener('click', () => {
      infowindow.close()
      activeInfoWindow = null
    })
  })
}


export const createFlightPath = (map: google.maps.Map, devicePath: { lat: number; lng: number }[]) => {
  const flightPath = new google.maps.Polyline({
    path: devicePath,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  })

  flightPath.setMap(map)
}
