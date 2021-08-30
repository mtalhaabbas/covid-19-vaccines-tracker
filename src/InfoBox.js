import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, date, total, active, isRed, ...props }) {
  console.log(title, active);
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          Total: {total}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          Last Updated: {date}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
