import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import * as d3 from "d3";
import WorkoutDetail from "../components/WorkoutDetail";
function VisualizeWorkouts() {
  const { userInfo } = useContext(UserContext);
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [graphVal, setGraphVal] = useState("weight"); //y axis value of the graph
  const [exerciseType, setExerciseType] = useState("");
  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:1337/workouts/" + userInfo.id,
        { method: "GET" }
      );
      setIsLoading(false);
      if (response.ok) {
        const json = await response.json();
        setWorkouts(json);
        if (json && Object.keys(json).length !== 0) {
          console.log(json);

          let data = [];
          json.forEach((workout) => {
            // console.log(workout);
            let val = null;
            if (graphVal === "weight") val = workout.weight;
            else if (graphVal === "reps") val = workout.reps;
            console.log(exerciseType);
            if (workout.name === exerciseType) {
              data.push({
                label: d3.timeParse("%Y-%m-%d")(workout.createdAt.slice(0, 10)),
                value: val,
              });
            }
          });
          console.log(data);

          //create d3 graph

          const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 960 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

          //remove previous graph
          d3.select("#graph svg").remove();
          // append the svg object to the body of the page
          const svg = d3
            .select("#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          // Add X axis --> it is a date format
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(data, function (d) {
                console.log(d.label);
                return d.label;
              })
            )
            .range([0, width]);
          svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

          // Add Y axis
          const y = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data, function (d) {
                return +d.value;
              }),
            ])
            .range([height, 0]);
          svg.append("g").call(d3.axisLeft(y));

          // Add the line
          svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 5)
            .attr(
              "d",
              d3
                .line()
                .x(function (d) {
                  return x(d.label);
                })
                .y(function (d) {
                  return y(d.value);
                })
            );
          function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          const mouseover = function (event, d) {
            Tooltip.style("opacity", 1);
          };
          const mousemove = function (event, d) {
            const text = `${capitalize(graphVal)}: ${d.value} ${
              graphVal === "weight" ? "lbs" : ""
            }<br/>Date: ${d.label.toString().slice(4, 15)}`;
            Tooltip.html(text)
              .style("left", `${event.layerX + 10}px`)
              .style("top", `${event.layerY}px`)
              .style("font-size", "medium");
          };
          const mouseleave = function (event, d) {
            Tooltip.style("opacity", 0);
          };
          const Tooltip = d3
            .select("#graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("color", "black")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
          svg
            .append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "steelblue")
            .attr("cx", function (d) {
              return x(d.label);
            })
            .attr("cy", function (d) {
              return y(d.value);
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        }
      }
    };
    if (userInfo) {
      fetchWorkouts();
    }
  }, [userInfo, graphVal, exerciseType]);
  /*
  return (
    <div id="workouts-div">
      <h1>Workouts</h1>
      {isLoading && <p>Loading...</p>}

      <table>
        <tr>
          <th>Exercise</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weight (lbs)</th>
          <th>Date</th>
        </tr>
        {workouts &&
          workouts.map((workout) => (
            <tr>
              <WorkoutDetail key={workout._id} workout={workout} />
            </tr>
          ))}
      </table>
    </div>
  );
  */

  return (
    <div id="visualize-div">
      {isLoading && <p>Loading...</p>}

      <div id="graph-options-div">
        <select
          id="exercise-options"
          onChange={(e) => setExerciseType(e.target.value)}
          style={{ width: "200px", height: "50px", fontSize: "20px" }}
        >
          <option value="">(Select Workout)</option>
          {workouts &&
            [...new Set(workouts.map((e) => e.name))].map((e) => (
              <option value={e}>{e}</option>
            ))}
        </select>
        <select
          id="y-axis-options"
          style={{ width: "90px", height: "50px", fontSize: "20px" }}
          onChange={(e) => setGraphVal(e.target.value)}
        >
          <option value="weight">Weight</option>
          <option value="reps">Reps</option>
        </select>
      </div>
      <div id="graph"></div>
    </div>
  );
}

export default VisualizeWorkouts;
