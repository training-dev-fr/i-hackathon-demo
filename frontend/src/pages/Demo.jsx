import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import ExercisesPage from "./student/ExercisesPage";

export default function Demo() {
    let { id } = useParams();
    const [exercice, setExercise] = useState({});
    useEffect(() => {
        async function loadExercice(id) {
            let result = await apiService.loadExercice(id);
            setExercise(result.data);
        }
        loadExercice(id)
    },[]);
    return (
        <ExercisesPage exercise={exercice}/>
    )
}