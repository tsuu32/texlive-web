import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar
}));

function Tlps(props, category, pageSizeOptions) {
  const classes = useStyles();

  return (
    <div className={classes.main}>
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

export { Packages, Collections, Schemes, ConTeXts, TLCores };
