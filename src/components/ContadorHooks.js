import React,{useState} from "react";

export const Contador=(props)=>{
    const [contador,setContador]=useState(0);
    const sumar=()=>{
        setContador(contador+1)
    };
    const restar=()=>{
        setContador(contador-1)
    }
    return(
        <>
        <h2>{props.titulo}</h2>
        <h2>{contador}</h2>
        <nav>
            <button onClick={sumar}>+</button>
            <button onClick={restar}>-</button>
        </nav>
        </>
    );
}
Contador.defaultProps={
    titulo:"TITULO PREDEFINIDO"
}