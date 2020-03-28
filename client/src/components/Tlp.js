import React, { useState, useEffect } from "react";

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
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar,
  tlp: {
    paddingRight: 25,
    paddingLeft: 25,
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: 20
  },
  tlpPaper: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fbfbfe"
  },
  tlpDepItem: {
    paddingTop: 0,
    paddingBottom: 0,
    color: "-webkit-link",
    textDecoration: "underline"
  }
}));

function Tlp(props) {
  const [tlp, setTlp] = useState();

  useEffect(() => {
    const f = async () => {
      fetch(`/api/tlp/${props.match.params.name}`)
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => {
              throw Error(err.error);
            });
          }
          return res.json();
        })
        .then(json => setTlp(json))
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
    <div className={classes.main}>
      <div className={classes.toolbar} />
      {tlp && (
        <div className={classes.tlp}>
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

          <Paper elevation={3} className={classes.tlpPaper}>
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
                        className={classes.tlpDepItem}
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
                      className={classes.tlpDepItem}
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
          <Paper elevation={3} className={classes.tlpPaper}>
            <Typography variant="body1">{tlp.longdesc}</Typography>
          </Paper>
        </div>
      )}
    </div>
  );
}

export default Tlp;
