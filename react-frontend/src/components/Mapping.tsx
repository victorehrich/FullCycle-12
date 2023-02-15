import { Grid, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Loader } from "google-maps";
import { FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { getCurrentPosition } from "../util/Geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/Map";
import { Route } from "../util/Route";
import { sample, shuffle } from "lodash";
import { RouteExistsError } from "../Errors/route-exist.error";
import { useSnackbar } from "notistack";
import { Navbar } from "./Navbar";
import io from 'socket.io-client';

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

const useStyles = makeStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    form: {
      margin: "16px",
    },
    btnSubmitWrapper: {
      textAlign: "center",
      marginTop: "8px",
    },
    map: {
      width: "100%",
      height: "100%",
    },
  });

export const Mapping:FunctionComponent = (props) =>{
    const classes = useStyles()
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routesIdSelected, setRouteIdSelected] = useState<string>("");
    const mapRef = useRef<Map>()
    const socketIORef = useRef<any>();
    
    const {enqueueSnackbar} = useSnackbar()
    
    const finishRoute = useCallback(
      (route: Route) => {
        enqueueSnackbar(`${route.title} finalizou!`, {
          variant: "success",
        });
        mapRef.current?.removeRoute(route._id);
      },
      [enqueueSnackbar]
    );

    useEffect(()=>{
      if (!socketIORef.current?.connected) {
        const socket = io(API_URL)
        socketIORef.current = socket.connect();
        socketIORef.current.on("connect", () => console.log("conectou"));
      }
      const handler = (data: {
        routeId: string;
        position: [number, number];
        finished: boolean;
      }) => {
        mapRef.current?.moveCurrentMarker(data.routeId, {
          lat: data.position[0],
          lng: data.position[1],
        });
        const route = routes.find((route) => route._id === data.routeId) as Route;
        if (data.finished) {
          finishRoute(route);
        }
      };
      socketIORef.current?.on("new-position", handler);
      return () => {
        socketIORef.current?.off("new-position", handler);
      };
    }, [finishRoute, routes, routesIdSelected]);

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
        if(!routesIdSelected){
          enqueueSnackbar(`Selecione uma rota!`, {
            variant: "error",
          });
          return
        }
        const route = routes.find((route) => route._id === routesIdSelected);
        const color = sample(shuffle(colors)) as string;
        try {
          mapRef.current?.addRoute(routesIdSelected, {
            currentMarkerOptions: {
              position: route?.startPosition,
              icon: makeCarIcon(color),
            },
            endMarkerOptions: {
              position: route?.endPosition,
              icon: makeMarkerIcon(color),
            },
          });
          socketIORef.current?.emit('new-direction',{
            routeId: routesIdSelected
          })
        } catch (error) {
            if(error instanceof RouteExistsError){
                enqueueSnackbar(`${route?.title} já foi adicionado. Necessário aguardar a finalização.`,{variant:'error'})
                return
            }
            throw error;
        }
      },
      [routesIdSelected, routes, enqueueSnackbar]
    );

    return(
        <Grid container className={classes.root}>
            <Grid item xs={12} sm={3}>
                <Navbar></Navbar>
                <form onSubmit={startRoute} className={classes.form}>
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
                    <div className={classes.btnSubmitWrapper}>
                    <Button type="submit" color="primary" variant="contained">
                        Iniciar uma corrida
                    </Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div id="map" className={classes.map}></div>
            </Grid>
        </Grid>
    );
}
