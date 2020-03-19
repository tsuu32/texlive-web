import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Hidden,
  Menu,
  MenuItem
  // TableContainer,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell,
  // TableFooter,
  // TablePagination
} from "@material-ui/core";
import MaterialTable from "material-table";
import MenuIcon from "@material-ui/icons/Menu";
import { Switch, Route, Redirect, Link, NavLink } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
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
  toolbar: theme.mixins.toolbar,
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  table: {
    minWidth: 650
  },
  tableHeader: {
    fontWeight: "bold"
  }
}));

function Demo() {
  const classes = useStyles();
  return (
    <div className="App" style={{ flexGrow: 1 }}>
      <div className={classes.toolbar} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// function Tlps(api, category) {
//   const [packages, setPackages] = useState([]);

//   useEffect(() => {
//     const f = async () => {
//       const res = await fetch(`/api/${api}`);
//       const json = await res.json();
//       setPackages(json);
//     };
//     f();
//   }, [api, setPackages]);

//   const [page, setPage] = React.useState(0);
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const classes = useStyles();
//   return (
//     <div style={{ flexGrow: 1 }}>
//       <div className={classes.toolbar} />
//       <TableContainer component={Paper}>
//         <Table className={classes.table} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>{category}</TableCell>
//               <TableCell>Revision</TableCell>
//               <TableCell>ShortDesc</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {packages.slice(page * 20, page * 20 + 20).map(row => (
//               <TableRow key={row.name}>
//                 <TableCell component="th" scope="row">
//                   <Link to={`/tlp/${row.name}`}>{row.name}</Link>
//                 </TableCell>
//                 <TableCell>{row.revision}</TableCell>
//                 <TableCell>{row.shortdesc}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TablePagination
//                 colSpan={3}
//                 count={packages.length}
//                 rowsPerPage={20}
//                 rowsPerPageOptions={[20]}
//                 page={page}
//                 onChangePage={handleChangePage}
//               />
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// }

function All() {
  const [all, setAll] = useState([]);

  useEffect(() => {
    const f = async () => {
      const res = await fetch("/api/all");
      res
        .json()
        .then(res => setAll(res))
        .catch(err => console.log(err));
    };
    f();
  }, [setAll]);

  const classes = useStyles();
  return (
    <div style={{ flexGrow: 1 }}>
      <div className={classes.toolbar} />
      <MaterialTable
        columns={[
          {
            title: "Name",
            field: "name",
            render: rowData => (
              <Link to={`/tlp/${rowData.name}`}>{rowData.name}</Link>
            )
          },
          { title: "Category", field: "category" },
          { title: "Revision", field: "revision", type: "numeric" },
          { title: "ShortDesc", field: "shortdesc" }
        ]}
        data={all}
        title={"All"}
        options={{
          draggable: false,
          emptyRowsWhenPaging: false,
          pageSize: 20,
          pageSizeOptions: [10, 20, 50],
          thirdSortClick: false
        }}
      />
    </div>
  );
}

function Tlps(api, category) {
  const [tlps, setTlps] = useState([]);

  useEffect(() => {
    const f = async () => {
      const res = await fetch(`/api/${api}`);
      res
        .json()
        .then(res => setTlps(res))
        .catch(err => console.log(err));
    };
    f();
  }, [api, setTlps]);

  const classes = useStyles();
  return (
    <div style={{ flexGrow: 1 }}>
      <div className={classes.toolbar} />
      <MaterialTable
        columns={[
          {
            title: category,
            field: "name",
            render: rowData => (
              <Link to={`/tlp/${rowData.name}`}>{rowData.name}</Link>
            )
          },
          { title: "Revision", field: "revision", type: "numeric" },
          { title: "ShortDesc", field: "shortdesc" }
        ]}
        data={tlps}
        title={`${category}s`}
        options={{
          draggable: false,
          emptyRowsWhenPaging: false,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          thirdSortClick: false
        }}
      />
    </div>
  );
}

function Packages() {
  return Tlps("packages", "Package");
}

function Collections() {
  return Tlps("collections", "Collection");
}

function Schemes() {
  return Tlps("schemes", "Scheme");
}

function ConTeXts() {
  return Tlps("contexts", "ConTeXt");
}

function TLCores() {
  return Tlps("tlcores", "TLCore");
}

function Tlp(props) {
  const [tlp, setTlp] = useState({});

  useEffect(() => {
    const f = async () => {
      const res = await fetch(`/api/tlp/${props.match.params.name}`);
      res
        .json()
        .then(res => setTlp(res))
        .catch(err => console.log(err));
    };
    f();
  }, [setTlp, props.match.params.name]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  return (
    <div style={{ flexGrow: 1 }}>
      <div className={classes.toolbar} />
      {tlp.name !== "" && (
        <div
          style={{
            paddingRight: 25,
            paddingLeft: 25,
            marginRight: "auto",
            marginLeft: "auto"
          }}
        >
          <Typography variant="subtitle1">{tlp.category}</Typography>
          <Typography variant="h4" style={{ marginBottom: 5 }}>
            {tlp.name}{" "}
            <Typography variant="subtitle2" component="small">
              <a
                href={`https://www.tug.org/svn/texlive?view=revision&revision=${tlp.revision}`}
              >
                {tlp.revision}
              </a>
            </Typography>
          </Typography>

          <Typography variant="subtitle2" style={{ marginBottom: 10 }}>
            {tlp.shortdesc}
          </Typography>

          <div style={{ marginBottom: 10 }}>
            <ButtonGroup variant="outlined" style={{ marginRight: 10 }}>
              {tlp.cataloguedata && tlp.cataloguedata["contact-home"] && (
                <Button href={tlp.cataloguedata["contact-home"]}>
                  Homepage
                </Button>
              )}
              {tlp.cataloguedata && tlp.cataloguedata["contact-support"] && (
                <Button href={tlp.cataloguedata["contact-support"]}>
                  Support
                </Button>
              )}
              {tlp.cataloguedata && tlp.cataloguedata["contact-repository"] && (
                <Button href={tlp.cataloguedata["contact-repository"]}>
                  Repo
                </Button>
              )}
              {tlp.cataloguedata && tlp.cataloguedata["contact-bugs"] && (
                <Button href={tlp.cataloguedata["contact-bugs"]}>
                  Bug Tracker
                </Button>
              )}
            </ButtonGroup>
            {tlp.cataloguedata && tlp.cataloguedata["ctan"] && (
              <ButtonGroup variant="outlined">
                <Button
                  href={`https://www.ctan.org/tex-archive${tlp.cataloguedata["ctan"]}`}
                >
                  CTAN
                </Button>
              </ButtonGroup>
            )}
          </div>

          <Grid container style={{ marginBottom: 10 }}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                style={{ padding: 15, backgroundColor: "#fbfbfe" }}
              >
                <Typography variant="h6">Version</Typography>
                <Typography variant="body1">
                  {(tlp.cataloguedata && tlp.cataloguedata.version) || "?"}
                </Typography>

                <Typography variant="h6">License</Typography>
                <Typography variant="body1">
                  {(tlp.cataloguedata && tlp.cataloguedata.license) || "?"}
                </Typography>

                <Typography variant="h6">Topics</Typography>
                <Typography variant="body1">
                  {(tlp.cataloguedata && tlp.cataloguedata.topics) || "?"}
                </Typography>

                <Typography variant="h6">Dependencies</Typography>
                <List>
                  {tlp.depends &&
                    tlp.depends.map(dep =>
                      dep.endsWith(".ARCH") ? (
                        <div key={dep}>
                          <ListItem
                            button
                            onClick={handleClick}
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              color: "-webkit-link",
                              textDecoration: "underline"
                            }}
                          >
                            <ListItemText primary={dep} />
                          </ListItem>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: 200
                              }
                            }}
                          >
                            {[
                              "aarch64-linux",
                              "amd64-freebsd",
                              "amd64-netbsd",
                              "armhf-linux",
                              "i386-cygwin",
                              "i386-freebsd",
                              "i386-linux",
                              "i386-netbsd",
                              "i386-solaris",
                              "win32",
                              "x86_64-cygwin",
                              "x86_64-darwin",
                              "x86_64-darwinlegacy",
                              "x86_64-linux",
                              "x86_64-linuxmusl",
                              "x86_64-solaris"
                            ].map(arch => (
                              <MenuItem
                                to={`/tlp/${dep.replace("ARCH", arch)}`}
                                component={Link}
                                key={arch}
                                onClick={handleClose}
                              >
                                {dep.replace("ARCH", arch)}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      ) : (
                        <ListItem
                          button
                          key={dep}
                          to={`/tlp/${dep}`}
                          component={Link}
                          style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                            color: "-webkit-link",
                            textDecoration: "underline"
                          }}
                        >
                          <ListItemText primary={dep} />
                        </ListItem>
                      )
                    )}
                </List>
              </Paper>
            </Grid>{" "}
          </Grid>

          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Long Description
          </Typography>
          <Grid container style={{ marginBottom: 10 }}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                style={{
                  padding: 15,
                  marginBottom: 10,
                  backgroundColor: "#fbfbfe"
                }}
              >
                <Typography variant="body1">{tlp.longdesc}</Typography>
              </Paper>
            </Grid>{" "}
          </Grid>
        </div>
      )}
    </div>
  );
}

function App() {
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

  const drawer = (
    <>
      <div
        className={classes.toolbar}
        style={{ display: "flex", alignItems: "center" }}
      >
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
            onClick={handleDrawerClose}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <Hidden smUp>
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerClose}
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

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            onClick={handleDrawerOpen}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            TeX Live Web
          </Typography>
          <Button color="inherit" href="https://www.tug.org/texlive/">
            Get TeX Live
          </Button>
        </Toolbar>
      </AppBar>

      <Switch>
        <Redirect exact from="/" to="/all" />
        <Route exact path="/all" component={All} />
        <Route exact path="/packages" component={Packages} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/schemes" component={Schemes} />
        <Route exact path="/contexts" component={ConTeXts} />
        <Route exact path="/tlcores" component={TLCores} />
        <Route exact path="/tlp/:name" component={Tlp} />
      </Switch>
    </div>
  );
}

export default App;
