import React, { useState, useEffect, useMemo } from "react";
import All from "./All";
import { Packages, Collections, Schemes, ConTeXts, TLCores } from "./Tlps";
import Tlp from "./Tlp";

import { Switch, Route, Redirect } from "react-router-dom";

function Main() {
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

  return (
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
      <Route exact path="/schemes" render={() => <Schemes tlps={schemes} />} />
      <Route
        exact
        path="/contexts"
        render={() => <ConTeXts tlps={contexts} />}
      />
      <Route exact path="/tlcores" render={() => <TLCores tlps={tlcores} />} />
      <Route exact path="/tlp/:name" component={Tlp} />
    </Switch>
  );
}

export default Main;
