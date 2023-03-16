import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import WorkoutDetail from "./WorkoutDetail";

function Workouts() {
  const { userInfo } = useContext(UserContext);
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:1337/api/workouts/" + userInfo.id,
        { method: "GET" }
      );
      setIsLoading(false);
      if (response.ok) {
        const json = await response.json();
        setWorkouts(json);
      }
    };
    if (userInfo) {
      fetchWorkouts();
    }
  }, [userInfo]);
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
}

export default Workouts;
