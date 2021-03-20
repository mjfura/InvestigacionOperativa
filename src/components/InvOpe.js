import "./InvOpe.css";
import {useState,useEffect,useRef} from "react";
import InvOpeModel from "./InvOpeModel";
export const InvOpe=(props)=>{
    
    const[generate, setGenerate]=useState(false);
    const [form,setForm]=useState({});
    const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    };
    
    const generateModel=()=>{
        setGenerate(true);
    };
    const getData=(value)=>{
        setGenerate(value);
    }
    return(
        <div className="InvOpe-block">
            <header className="header-block">
                <h1>{props.title}</h1>
            </header>
            <main className="main-block">
                <h2>Seleccione el método a utilizar</h2>
                <select className="style-select-home" defaultValue="" onChange={handleChange}  name="metodoSolucion" id="select-metodo">
                    <option value="">---</option>
                    <option value="simplex">Metodo Simplex</option>
                    <option value="graph">Metodo Gráfico</option>
                </select>
                <h2>Ingrese el número de variables </h2>
                <input className="style-input-home" name="variables" onChange={handleChange}  type="number"/>
                <h2>Ingrese el número de restricciones</h2>
                <input className="style-input-home" name="restricciones" onChange={handleChange} type="number"/>
                <h2>Seleccione que tipo de formulación es: </h2>
                <select className="style-select-home" defaultValue="" onChange={handleChange} name="maxMin" id="select-maxMin">
                    <option value="">---</option>
                    <option value="Max">Maximizar</option>
                    <option value="Min">Minimizar</option>
                </select>
                <button onClick={generateModel} className="button-element">Generar modelo</button>
                {generate && <InvOpeModel var={form.variables} 
                caso={form.maxMin} rest={form.restricciones} sendData={getData}/> }
                
            </main>
        </div>
    )
}
InvOpe.defaultProps={
    title:"Investigación de Operaciones"
}