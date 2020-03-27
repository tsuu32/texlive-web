import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Hidden
} from "@material-ui/core";
import { NavLink } from "react-router-dom";

export const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: "flex",
    alignItems: "center"
  }
}));

function SideBar(props) {
  const classes = useStyles();

  const drawer = (
    <>
      <div className={classes.toolbar}>
        <Typography variant="h6" style={{ paddingLeft: 10 }}>
          TeX Live Web
        </Typography>
      </div>
      <Divider />
      <List>
        {[
          "All",
          "Packages",
          "Collections",
          "Schemes",
          "ConTeXts",
          "TLCores"
        ].map((text, index) => (
          <ListItem
            button
            key={text}
            to={`/${text.toLowerCase()}`}
            activeStyle={{ color: "#1178b6" }}
            component={NavLink}
            onClick={props.handleDrawerClose}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden smUp>
        <Drawer
          variant="temporary"
          open={props.open}
          onClose={props.handleDrawerClose}
          classes={{
            paper: classes.drawerPaper
          }}
          anchor="left"
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
          anchor="left"
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default SideBar;
