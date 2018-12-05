import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

const Needs = ({ needs }) => (
  <ListGroup>
    {needs.map(need => {
      if (need.percentile > 0.8) {
        return (
          <ListGroupItem style={{ fontWeight: "bold" }} key={need.trait_id}>
            {need.name} {need.percentile.toFixed(2)}
          </ListGroupItem>
        );
      } else if (need.percentile > 0.66) {
        return (
          <ListGroupItem style={{ fontStyle: "italic" }} key={need.trait_id}>
            {need.name} {need.percentile.toFixed(2)}
          </ListGroupItem>
        );
      } else if (need.percentile < 0.33) {
        return (
          <ListGroupItem key={need.trait_id} style={{ color: "red" }}>
            {need.name} {need.percentile.toFixed(2)}
          </ListGroupItem>
        );
      } else {
        return (
          <ListGroupItem key={need.trait_id}>
            {need.name} {need.percentile.toFixed(2)}
          </ListGroupItem>
        );
      }
    })}
  </ListGroup>
);

export default Needs;
