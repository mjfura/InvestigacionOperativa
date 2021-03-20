import { useEffect,useState } from "react";
import "./InvOpeModel.css";
import { MetodoSimplex } from "./MetodoSimplex";
const InvOpeModel=(props)=>{
    const[start,setStart]=useState(false);
    const [variables,setVariables]=useState(null);
    const[coef,setCoef]=useState({});
    
   const handleChange=(e)=>{
    setCoef({
        ...coef,
        [e.target.name]:e.target.value
    });
   };
   useEffect(()=>{
        let variable="";
        for(let i=0;i<props.var;i++){
            
            if(i===0){
                
                variable=<h3>x{i+1}</h3>;
            }
            else{
                variable=<>{variable}<h3>,x{i+1}</h3></>;
            }
        };
        
        setVariables(variable);
        
    },[]);
    const generateFunctionModel=()=>{
        const prevFunction=<h3>{props.caso} ƒ()=</h3>;
        let functionModel="";
        let variable="";
        for(let i=0;i<props.var;i++){
            
            if(i===0){
                functionModel=<><input onChange={handleChange} name={`c${i+1}`} className="input" type="number"/><h3>x{i+1}</h3>
                </>;
                variable=<h3>x{i+1}</h3>;
            }
            else{
                functionModel=<>{functionModel}<h3>+</h3><input onChange={handleChange} name={`c${i+1}`} className="input" type="number"/><h3>x{i+1}</h3></>
                variable=<>{variable}<h3>,x{i+1}</h3></>;
            }
        };
        return <>
            {prevFunction}{functionModel}
        </>;
    };
    const generateRest=()=>{
        let restModel="";
        const signos={
            mayor:">=",
            menor:"<="
        };
    
        for(let i=0;i<props.rest;i++){
            let li="";
            for(let j=0;j<props.var;j++){
                if(j===0){
                    li=<><input onChange={handleChange} name={`a${i+1}${j+1}`} className="input" type="number"/><h3>x{j+1}</h3></>
                }
                else{
                    li=<>{li}<h3> + </h3><input onChange={handleChange} name={`a${i+1}${j+1}`} className="input" type="number"/><h3>x{j+1}</h3></>;
            
                }
            }
            li=<li className="restriccion-model">{li}<select onChange={handleChange} className="select" defaultValue="" name={`l${i+1}`}>
                <option value="">---</option>
                <option value=">=">≥</option>
                <option value="<=">≤ </option>
                <option value="=">=</option>
                </select><input onChange={handleChange} name={`b${i+1}`} className="input" type="number"/></li>;
            restModel=<>{restModel}{li}</>

            /*restModel=<>{restModel}<li className="restriccion">{modelFunction} <select className="select" name="operador">
                    <option value=">=" >{signos.mayor}</option>
                    <option value="<=" >{signos.menor}</option>
                    <option value="=">=</option>
                </select> <input className="input" type="number"/></li></>*/
        };
        return restModel=<>{restModel}<li className="restriccion-model">{variables}<h3>≥0</h3></li></>
    };
    const sendCoef=()=>{
        setStart(true);
    }
    const stop=()=>{
        setStart(false);
        props.sendData(false);
    }
    return(
        <div className="model-block">
                <div className="function">
                    {generateFunctionModel()}
                </div>
                <div className="rest">
                   {generateRest()}
                </div>
                <button onClick={sendCoef} className="button-element">Iniciar</button>
                <button className="button-element" onClick={stop}>Nuevo problema</button>
                {start && <MetodoSimplex numVar={props.var} numRest={props.rest} caso={props.caso} coef={coef}/>}
        </div>
    );
}
export default InvOpeModel;