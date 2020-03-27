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

function All(props) {
  const classes = useStyles();

  return (
    <div className={classes.main}>
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

export default All;
