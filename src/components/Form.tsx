import { Dispatch, FormEvent, useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import categories from "../data/categories";
import { Activity } from "../types";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState : Activity = {
    id: uuidv4(),
    category: 1,
    name: "",
    calories: 0
}

export default function Form({dispatch, state} : FormProps) {

    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        const selectedActivity = state.activities.find((task) => task.id === state.activeId)
        if(selectedActivity) {
            setActivity({...selectedActivity})
        }
        
    }, [state.activeId]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const isNumberField = ['category', 'calories'].includes(e.target.id)
        
            setActivity({
                ...activity,
                [e.target.id]: isNumberField ? +e.target.value : e.target.value
            })   
    }

    const isValidActivity = () => {
        const {name, calories} = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>  {
        e.preventDefault()
        
        dispatch({type: "save-activity", payload: {newActivity: activity}})
        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }

    return (
        <form 
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label className="font-bold" htmlFor="category">
                    Categoría:
                </label>
                <select
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    id="category"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                <label className="font-bold" htmlFor="name">
                    Actividad:
                </label>
                <input
                    type="text"
                    id="name"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label className="font-bold" htmlFor="calories">
                    Calorias:
                </label>
                <input
                    type="number"
                    id="calories"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    placeholder="Calorias. ej. 300 o 500"
                    value={activity.calories}
                    onChange={handleChange}
                />
            </div>

            <input 
            type="submit" 
            className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
            value={activity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio"}
            disabled={!isValidActivity()}
            />
        </form>
    );
}
