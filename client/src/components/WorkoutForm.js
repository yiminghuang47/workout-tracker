import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";

function WorkoutForm() {
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const { setUserInfo, userInfo } = useContext(UserContext);

  async function addWorkout(e) {
    e.preventDefault();
    if (userInfo === null || Object.keys(userInfo).length == 0) {
      alert("You must log in first!");
      return;
    }
    const user_id = userInfo.id;
    const workout = { user_id, name, reps, sets, weight };
    if (!user_id || !name || !reps || !sets || !weight) {
      alert("Please fill in all fields");
      return;
    }
    const response = await fetch("http://localhost:1337/api/create", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Workout added");
      setName("");
      setReps("");
      setSets("");
      setWeight("");
    } else {
      alert("Failed to add workout");
    }
  }
  return (
    <div id="workout-form-div">
      <form className="workout-form" onSubmit={addWorkout}>
        <div>
          <label for="exercise-input">Exercise:</label>
          <input
            type="text"
            id="exercise-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />
        <div>
          <label for="sets-input">Sets:</label>
          <input
            type="number"
            value={sets}
            id="sets-input"
            onChange={(e) => setSets(e.target.value)}
          />
          <label for="reps-input">Reps:</label>
          <input
            type="number"
            value={reps}
            id="reps-input"
            onChange={(e) => setReps(e.target.value)}
          />
        </div>

        <br />
        <div>
          <label for="weight-input">Weight:</label>
          <input
            type="number"
            value={weight}
            id="weight-input"
            onChange={(e) => setWeight(e.target.value)}
          />
          <label for="weight-input">lbs</label>
        </div>

        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
