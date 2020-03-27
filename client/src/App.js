import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import Main from "./components/Main";

import { makeStyles } from "@material-ui/core/styles";

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

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />

      <Main />
    </div>
  );
}

export default App;
