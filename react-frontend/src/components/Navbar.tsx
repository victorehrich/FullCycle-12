import { AppBar, IconButton, Toolbar } from "@material-ui/core"
import { FunctionComponent } from "react"
import DriveIcon from "@material-ui/icons/DriveEta"
import { Typography } from "@mui/material"
export const Navbar:FunctionComponent = () =>{
    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge='start' color="inherit" aria-label="menu"></IconButton>
                    <DriveIcon></DriveIcon>
                    <Typography variant="h6">Code Delivery</Typography>
                </Toolbar>
            </AppBar>
    )
}