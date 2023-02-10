import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Loader } from "google-maps";
import { FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { getCurrentPosition } from "../util/Geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/Map";
import { Route } from "../util/Route";
import { sample, shuffle } from "lodash";

const API_URL = process.env.REACT_APP_API_URL as string;

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

export const Mapping:FunctionComponent = (props) =>{
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routesIdSelected, setRouteIdSelected] = useState<string>("");
    const mapRef = useRef<Map>()

    useEffect(() => {
        fetch(`${API_URL}/routes`)
          .then((data) => data.json())
          .then((data) => setRoutes(data));
      }, []);

    useEffect(() => {
        (async ()=>{
            const [,position] = await Promise.all([
                googleMapsLoader.load(),
                getCurrentPosition({enableHighAccuracy:true})
            ])
            const divMap = document.getElementById('map') as HTMLElement
            mapRef.current = new Map(divMap,{
                zoom:15,
                center:position
            })
        })()
    }, []);
    const startRoute = useCallback(
      (event: FormEvent) => {
        event.preventDefault();
        const route = routes.find((route) => route._id === routesIdSelected);
        const color = sample(shuffle(colors)) as string;

        mapRef.current?.addRoute(routesIdSelected, {
          currentMarkerOptions: {
            position: route?.startPosition,
            icon: makeCarIcon(color)
          },
          endMarkerOptions: {
            position: route?.endPosition,
            icon: makeMarkerIcon(color)
          },
        });
      },
      [routesIdSelected, routes]
    );

    return(
        <Grid container style={{width:'100%', height:'100%'}}>
            <Grid item xs={12} sm={3}>
                <form onSubmit={startRoute}>
                    <Select fullWidth value={routesIdSelected} 
                    onChange={(event) => setRouteIdSelected(event.target.value + "")}>
                        <MenuItem value="">
                            <em>Selecione uma corrida</em>
                        </MenuItem>
                        {routes.map((route,key)=>(
                            <MenuItem value={route._id} key={key}>
                                {route.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button type="submit" color="primary" variant="contained">
                        Iniciar uma corrida
                    </Button>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div id="map" style={{width:'100%', height:'100%'}}></div>
            </Grid>
        </Grid>
    );
}