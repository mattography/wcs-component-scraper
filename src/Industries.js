import React, { useState, useEffect } from "react";

import Container from "@mui/material/Container";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { saveToCSV } from "./utils/saveToCSV";
import Link from "@material-ui/core/Link";
import Tooltip from "@mui/material/Tooltip";
import Download from "@mui/icons-material/Download";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WarningAmber from "@mui/icons-material/WarningAmber";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

function Industries(props) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getData = () => {
    setIsLoading(true);
    fetch("./cleanedAppsPillarsIds.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setData(Object.entries(data));
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  function createData(id, keyName, urlsCount, links) {
    return {
      id,
      keyName,
      urlsCount,
      links,
    };
  }

  const rows = [];

  //Loop over component data and filter by largest number of impacted pages
  data &&
    data
      .filter(
        (f) =>
          f[0].includes(props.searchFilter.toUpperCase()) &&
          (props.a11yType === "" || f[1].type === props.a11yType)
      )
      .map((item, i) => {
        //If component has a type, push into rows array
        {
          item[1].type &&
            rows.push(
              createData(
                `${item[0]}`,
                `${item[1].type}`,
                `${[...new Set(item[1].urls)].length}`,
                `${item[1].urls}`
              )
            );
        }
      });

  function Row(props) {
    const { row } = props;
    const { links } = row;
    const dedupedLinks = [...new Set(links.split(","))];

    const [open, setOpen] = useState(false);

    function ComponentType(type) {
      let status = {
        "a11y-ready": <QuestionMarkIcon className="a11yReadyTag" />,
        "a11y-unknown": <WarningAmber className="a11yUnknownTag" />,
        "a11y-true": <CheckCircleOutline className="a11yTrueTag" />,
      }[type];
      return status;
    }

    // Check if id has variant: eg U30v3
    let idWithVariant = row.id.includes("v");
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {props.rowNum}
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="a11yStatusWrapper">
              <span>{row.id}</span>
              <span>{ComponentType(row.keyName)}</span>
            </div>
          </TableCell>
          <TableCell component="th" scope="row">
            {dedupedLinks.length}
          </TableCell>
          <TableCell component="th" scope="row">
            <Chip
              label="Dev"
              component="a"
              href={`https://webstandards-dev.oraclecorp.com/redwood/components/${
                row.id.toLowerCase().split("v")[0]
              }.html${idWithVariant ? `#${row.id.split("v")[1]}` : ""}`}
              clickable
            />{" "}
            /{" "}
            <Chip
              style={{ backgroundColor: "#000", color: "#fff" }}
              label="Prod"
              component="a"
              href={`https://webstandards.oraclecorp.com/redwood/components/${
                row.id.toLowerCase().split("v")[0]
              }.html${idWithVariant ? `#${row.id.split("v")[1]}` : ""}`}
              clickable
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {[...new Set(links.split(","))].map((link, i) => (
                  <List component="nav" key={i}>
                    <ListItem>
                      <a href={link} target="_blank">
                        {link}
                      </a>
                    </ListItem>
                    <Divider />
                  </List>
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Container maxWidth="xlg">
        {isLoading ? (
          <div className="loading">
            <p>Loading components...</p>
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="components-details">
              <p>Data last updated: 7/18/2022</p>{" "}
              <Tooltip title="Download Industries CSV">
                <Link
                  href="#"
                  underline="none"
                  id="download-link"
                  onClick={() => saveToCSV(rows)}
                  download="wcs-industries-components.csv"
                >
                  <span>Download CSV</span>
                  <Download />
                </Link>
              </Tooltip>
            </div>
            <p>
              There {rows.length >= 0 ? "are" : "is"}{" "}
              {rows.length > 1 && "a combined "}
              <strong>{rows.length}</strong>{" "}
              {rows.length >= 0 ? "components" : "component"}{" "}
              {rows.length > 1
                ? "and their variants across all Industries pages"
                : ""}{" "}
              {props.a11yType != "" ? `that are ${props.a11yType}` : null}{" "}
              {props.searchFilter &&
                `matching the term "${props.searchFilter}"`}
            </p>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left">Row #</TableCell>
                    <TableCell>
                      <strong>Component</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Pages</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Web Standards</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .sort((a, b) => b.urlsCount - a.urlsCount)
                    .map((row, i) => (
                      <Row keyName={row.name} row={row} rowNum={i} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </div>
  );
}

export default Industries;
