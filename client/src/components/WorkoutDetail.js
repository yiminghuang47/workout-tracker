import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
function WorkoutDetail({workout}) {
  //console.log(workout);
  
  async function deleteWorkout(e){
    e.preventDefault();
    console.log(workout._id);
    const response = await fetch("http://localhost:1337/api/workouts/"+workout._id,{
      method: "DELETE"
    });
    const json = await response.json();
    if(response.ok){
      alert("Workout Deleted");
      window.location.reload();
    }
    else{
      alert("Error when deleting the workout");
    }
  }
  return (
    <>
    <td>{workout.name}</td>
    <td>{workout.sets}</td>
    <td>{workout.reps}</td>
    <td>{workout.weight}</td>
    <td>{workout.createdAt.slice(0,10)}</td>
    <td><FontAwesomeIcon icon={faTrash} onClick={deleteWorkout}/></td>
    
    

    </>
    //<p>{workout}</p>
  )
}

export default WorkoutDetail