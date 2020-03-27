import React, { useState } from "react";
import SideBar, { drawerWidth } from "./SideBar";

import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Switch, Route } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: "#1179b6",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  headerTitle: {
    flexGrow: 1
  }
}));

function TlpHeader(props) {
  const handleBack = () => {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.push("/all");
    }
  };

  const classes = useStyles();

  return (
    <>
      <IconButton
        className={classes.backButton}
        onClick={handleBack}
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h6" className={classes.headerTitle}>
        {props.match.params.name}
      </Typography>
    </>
  );
}

function TeXLiveWebHeader(props) {
  const classes = useStyles();

  return (
    <>
      <IconButton
        className={classes.menuButton}
        onClick={props.handleDrawerOpen}
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>

      <Typography variant="h6" className={classes.headerTitle}>
        TeX Live Web
      </Typography>
    </>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  // useCallback is better
  // https://sbfl.net/blog/2019/02/20/react-only-tutorial/
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <>
      <SideBar open={open} handleDrawerClose={handleDrawerClose} />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Switch>
            <Route exact path="/tlp/:name" component={TlpHeader} />
            <Route
              render={props => (
                <TeXLiveWebHeader
                  {...props}
                  handleDrawerOpen={handleDrawerOpen}
                />
              )}
            />
          </Switch>

          <Button color="inherit" href="https://www.tug.org/texlive/">
            Get TeX Live
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
