import React, { useState, useEffect, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar";

import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  Paper,
  Menu,
  MenuItem
} from "@material-ui/core";
import MaterialTable from "material-table";
import { Switch, Route, Redirect, Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: theme.mixins.toolbar
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

function All(props) {
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
        data={props.all}
        title={"All"}
        options={{
          draggable: false,
          emptyRowsWhenPaging: false,
          pageSize: 20,
          pageSizeOptions: [20, 50, 100],
          thirdSortClick: false
        }}
      />
    </div>
  );
}

function Tlps(props, category, pageSizeOptions) {
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
        data={props.tlps}
        title={`${category}s`}
        options={{
          draggable: false,
          emptyRowsWhenPaging: false,
          pageSize: pageSizeOptions[0],
          pageSizeOptions: pageSizeOptions,
          thirdSortClick: false
        }}
      />
    </div>
  );
}

function Packages(props) {
  return Tlps(props, "Package", [20, 50, 100]);
}

function Collections(props) {
  return Tlps(props, "Collection", [20, 50]);
}

function Schemes(props) {
  return Tlps(props, "Scheme", [10]);
}

function ConTeXts(props) {
  return Tlps(props, "ConTeXt", [20, 50]);
}

function TLCores(props) {
  return Tlps(props, "TLCore", [20, 50, 100]);
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

  const handleClickArch = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseArch = () => {
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

          <Paper
            elevation={3}
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: "#fbfbfe"
            }}
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
                        onClick={handleClickArch}
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
                        onClose={handleCloseArch}
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
                            onClick={handleCloseArch}
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

          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Long Description
          </Typography>
          <Paper
            elevation={3}
            style={{
              padding: 15,
              marginBottom: 20,
              backgroundColor: "#fbfbfe"
            }}
          >
            <Typography variant="body1">{tlp.longdesc}</Typography>
          </Paper>
        </div>
      )}
    </div>
  );
}

function App() {
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

  const packages = useMemo(() => {
    return all.filter(tlp => tlp.category === "Package");
  }, [all]);

  const collections = useMemo(() => {
    return all.filter(tlp => tlp.category === "Collection");
  }, [all]);

  const schemes = useMemo(() => {
    return all.filter(tlp => tlp.category === "Scheme");
  }, [all]);

  const contexts = useMemo(() => {
    return all.filter(tlp => tlp.category === "ConTeXt");
  }, [all]);

  const tlcores = useMemo(() => {
    return all.filter(tlp => tlp.category === "TLCore");
  }, [all]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />

      <Switch>
        <Redirect exact from="/" to="/all" />
        <Route exact path="/all" render={() => <All all={all} />} />
        <Route
          exact
          path="/packages"
          render={() => <Packages tlps={packages} />}
        />
        <Route
          exact
          path="/collections"
          render={() => <Collections tlps={collections} />}
        />
        <Route
          exact
          path="/schemes"
          render={() => <Schemes tlps={schemes} />}
        />
        <Route
          exact
          path="/contexts"
          render={() => <ConTeXts tlps={contexts} />}
        />
        <Route
          exact
          path="/tlcores"
          render={() => <TLCores tlps={tlcores} />}
        />
        <Route exact path="/tlp/:name" component={Tlp} />
      </Switch>
    </div>
  );
}

export default App;
