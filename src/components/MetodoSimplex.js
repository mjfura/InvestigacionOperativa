import "./MetodoSimplex.css";
import {useState,useEffect} from "react";
export const MetodoSimplex=(props)=>{
    const[respuesta,setRespuesta]=useState(null);
    const[coef,setCoef]=useState({});
    const[aceptar,setAceptar]=useState(false);
    const[cuadros,setCuadros]=useState(null);
    
    useEffect(()=>{
        
    const getVarOut=(varIn,coefActual,restActual)=>{
        let varOut={};
        let valor=999999999;
        let menor=0;
        let indexI=0;
        let count=0;
        let isIlimit=false;
        for(let i=0;i<restActual;i++){
            if(parseFloat(coefActual[`a${i+1}${varIn.index}`])>0){
                if(parseFloat(coefActual[`b${i+1}`])/parseFloat(coefActual[`a${i+1}${varIn.index}`])<valor){
                    valor=parseFloat(coefActual[`b${i+1}`])/parseFloat(coefActual[`a${i+1}${varIn.index}`]);
                    menor=coefActual[`a${i+1}${varIn.index}`];
                    indexI=i+1;
                    
                }
            }
            else{
                count++;
            }
        }
        if(count===restActual)  isIlimit=true;
        return varOut={
            isIlimit,
            menor,
            indexI,
            vbOut:`x${indexI+parseInt(props.numVar)}`
        };
    };
    const handleChangeSimplex=(varIn,varOut,coefActual, restActual)=>{
        let coefCopy=coefActual;
        const num=parseInt(props.numVar)+parseInt(restActual);
        coefCopy[`vb${varOut.indexI}`]=varIn.vnbIn;
        let factor=1;
        for(let i=0;i<=restActual;i++){
           
            (i===0)?factor=-1*parseFloat(coefCopy[`c${varIn.index}`])/parseFloat(varOut.menor)
            :factor=-1*parseFloat(coefCopy[`a${i}${varIn.index}`])/parseFloat(varOut.menor);
            if(parseFloat(coefCopy[`a${i}${varIn.index}`])!==0  ){
                console.log(varOut.menor, "PIVOTE", coefCopy[`a${i}${varIn.index}`],"A42",i,"Contador i")
                
                for(let j=0;j<=num;j++){
                    if(i!==varOut.indexI){

                        if(i===0 && j===0){
                            coefCopy[`b${j}`]=parseFloat(coefCopy[`b${j}`])+factor*parseFloat(coefCopy[`b${varOut.indexI}`]);
                        }
                        else{
                            if(i===0){
                                coefCopy[`c${j}`]=parseFloat(coefCopy[`c${j}`])+factor*parseFloat(coefCopy[`a${varOut.indexI}${j}`]);
                            }
                            else{
                                if(j===0){
                                    console.log(coefCopy[`b${i}`],"VALOR DE B ANTES DEL FACTOR")
                                    coefCopy[`b${i}`]=parseFloat(coefCopy[`b${i}`])+factor*parseFloat(coefCopy[`b${varOut.indexI}`]);
                                    console.log(coefCopy[`b${i}`], "VALOR DE B", coefCopy[`b${varOut.indexI}`],"VALOR DE B PIVOTE",coefCopy.b2,factor, "Factor")
                                }
                                else{
                                    coefCopy[`a${i}${j}`]=parseFloat(coefCopy[`a${i}${j}`])+factor*parseFloat(coefCopy[`a${varOut.indexI}${j}`]);
                                }
                            }
                        }
                    }
                }
            }
            
        }
        for(let j=0;j<=num;j++){
            (j!==0)? coefCopy[`a${varOut.indexI}${j}`]=parseFloat(coefCopy[`a${varOut.indexI}${j}`])/parseFloat(varOut.menor):
                       coefCopy[`b${varOut.indexI}`]=parseFloat(coefCopy[`b${varOut.indexI}`])/parseFloat(varOut.menor);
        }
        if(props.caso==="mmin"){
            coefCopy.b0=-1*parseFloat(coefCopy.b0);
        }
        return coefCopy;
    }
    const metodoSimplex=(coef,restActual,varNoBasic)=>{
        let coefCopy=coef;
        let varNb=[];
        varNb=varNoBasic;
        let isAll=verifyCoef(coefCopy,varNb);
        let li=mostrarCuadro(coefCopy,restActual);
        if(!isAll){
            do{
                let varIn= getVarIn(coefCopy,varNb),
                varOut=getVarOut(varIn,coefCopy,restActual);
                
                if(!varOut.isIlimit){
                    coefCopy=handleChangeSimplex(varIn,varOut,coefCopy,restActual);
                    isAll=verifyCoef(coefCopy,varNb);
                    li=<>{li}{mostrarCuadro(coefCopy,restActual)}</>
                }else{
                 li=<>{li}<h3>EL PROBLEMA PRESENTA SOLUCIONES ILIMITADAS</h3></>;
                 isAll=true
                };
                 
            }while(!isAll);
            li=<div className="group-cuadro-block">{li}</div>
        }
        setCuadros(li);
        
        return coefCopy;
    }
    const verifyCoef=(coefActual,varnb)=>{
        let isFinished=true;
      
        varnb.forEach((el)=>{
            if(parseFloat(coefActual[`c${el}`])<0)
            isFinished=false;
        });
        return isFinished;
        }
    const getVarIn=(coefActual,varnb)=>{
        let varIn={};
        let menor=0,
        index=0;
        varnb.forEach((el)=>{
            if(parseFloat(coefActual[`c${el}`])<menor){
                menor=parseFloat(coefActual[`c${el}`]);
                index=el
            }
        });
        return varIn={
            menor,
            index,
            vnbIn:`x${index}`
        };
    };

    const preGenerateCoefGain=(coefActual)=>{
        const numVar=parseInt(props.numRest)+parseInt(props.numVar);
        let coefCopy=coefActual;
        let res={};
        coefCopy={
            ...coefCopy,
            b0:0,
            f:1
        }
        let varNb=[];
        for(let i=0;i<numVar;i++){
            varNb.push(i+1);
            coefCopy={
                ...coefCopy,
                [`vnb${i+1}`]:`x${i+1}`
            }

            if(i<props.numVar){
                

                (props.caso==="Min")?coefCopy[`c${i+1}`]=parseFloat(coefCopy[`c${i+1}`]):coefCopy[`c${i+1}`]=-1*parseFloat(coefCopy[`c${i+1}`]);
            }else{
                coefCopy[`c${i+1}`]=0;
            }

        }
        for(let j=0;j<props.numRest;j++){
            coefCopy={
                ...coefCopy,
                [`vb${j+1}`]:`x${j+parseInt(props.numVar)+1}`
            }
        }
        return res={
            coefCopy,
            varNb
        };
    }
    
    const generatePadron=(coefActual)=>{
        let coefCopy=coefActual;
        const numVar=parseInt(props.numVar)+parseInt(props.numRest);
        for(let i=0;i<props.numRest;i++){
            for(let j=parseInt(props.numVar);j<numVar;j++){
                if(coefCopy[`l${i+1}`]==="<="){
                    if(i===j-props.numVar){
                        coefCopy={
                            ...coefCopy,
                            [`a${i+1}${j+1}`]:"1"
                        };
                    }
                    else{
                        coefCopy={
                            ...coefCopy,
                            [`a${i+1}${j+1}`]:"0"
                        }
                    }
                }
               
            }
        }
        
        return coefCopy;
    };
    const mostrarCuadro=(coef,numRestInit)=>{
        const col=parseInt(props.numVar)+parseInt(numRestInit)+1;
        const row=parseInt(props.numRest)+1;
        console.log(col,row,"COLUMNAS Y FILAS");
        let ul=<></>;
        let x=<></>;
        for(let i=0;i<row;i++){
            let a=<></>;
            let b=<></>;
            let c=<></>;
            for(let j=0;j<col;j++){
                if(j<col-1) x=<>{x}<h3 className="coef">{coef[`vnb${j+1}`]}</h3></>
                if(i===0 && j===0){
                    b=<h3 className="coef">{(coef.b0.toString().indexOf(".")===-1)?coef.b0:parseFloat(coef.b0).toFixed(2)}</h3>
                }
                else{
                    if(i===0){
                        c=<>{c}<h3 className="coef">{(coef[`c${j}`].toString().indexOf(".")===-1)?coef[`c${j}`]:parseFloat(coef[`c${j}`]).toFixed(2)}</h3></>
                    }
                    else{
                        if(j===0){
                            b=<h3 className="coef">{ (coef[`b${i}`].toString().indexOf(".")===-1)?coef[`b${i}`]:parseFloat(coef[`b${i}`]).toFixed(2)}</h3>
                        }
                        else{
                            a=<>{a}<h3 className="coef">{(coef[`a${i}${j}`].toString().indexOf(".")===-1)?coef[`a${i}${j}`]:parseFloat(coef[`a${i}${j}`]).toFixed(2)}</h3></>
                        }
                    }
                }
            }
            if(i===0){
                c=<li className="restriccion"><h3 className="coef">---</h3><h3 className="coef">1</h3>{c}{b}</li>;
                x=<li className="restriccion"><h3 className="coef">Base</h3><h3 className="coef">F</h3>{x}
                <h3 className="coef">b</h3></li>
                ul=<>{x}{c}</>;
            }
            else{

                a=<li className="restriccion"><h3 className="coef">{coef[`vb${i}`]}</h3><h3 className="coef">0</h3>{a}{b}</li>
                
                ul=<>{ul}{a}</>
            }
        }
        ul=<ul className="ul-block-cuadro">{ul}</ul>;
        return ul;
    }
    const handleNegative=()=>{
        let coefCopy=props.coef;
        for(let i=0;i<props.numRest;i++){
             
            if(parseFloat(coefCopy[`b${i+1}`])<0){
                (coefCopy[`l${i+1}`]==="<=")?coefCopy[`l${i+1}`]=">="
                :(coefCopy[`l${i+1}`]===">=")?coefCopy[`l${i+1}`]="<=":
                coefCopy[`l${i+1}`]="=";
                
                for(let j=0;j<props.numVar;j++){
                    coefCopy[`a${i+1}${j+1}`]=-1*parseFloat(coefCopy[`a${i+1}${j+1}`]);
                    
                }
                coefCopy[`b${i+1}`]=-1*parseFloat(coefCopy[`b${i+1}`]);
            }
        }
        return coefCopy;
    }
    const verifyRest=(coefCopy)=>{
        let coef=coefCopy;
        let res;
        let isFase=false;
        let count=0;
        for(let i=0;i<props.numRest;i++){
            if(coef[`l${i+1}`]===">="){
                count=count+2;
                isFase=true;
            }
            else{
                if(coef[`l${i+1}`]==="="){
                    isFase=true;
                }
                count++;
            }
        }
        return res={
            count,
            isFase
        };
    }
    const generateModel=(coefActual,count)=>{
        let coef=coefActual,
        res={},
        limit=count+parseInt(props.numVar);
        let iterator=0;
        let basics=0;
        let varArtificial=[];
        let varNoBasic=[];
        for(let k=0;k<limit;k++){
            if(k>=props.numVar){
                coef={
                    ...coef,
                    [`c${k+1}`]:0
                }
            }
            else{
                varNoBasic.push(k+1);
            }
        }
        for(let i=0;i<props.numRest;i++){
            let next=false;
            for(let j=parseInt(props.numVar);j<limit;j++){
                if(coef[`l${i+1}`]===">="){
                    if(i+iterator===j-props.numVar){
                        basics++;
                        coef={
                            ...coef,
                            [`a${i+1}${j+1}`]:"-1",
                            [`a${i+1}${j+2}`]:"1",
                            [`vb${basics}`]:`x${j+2}`,
                            [`c${j+2}`]:"100"
                        };
                        varArtificial.push(basics);
                        varNoBasic.push(j+1);

                        next=true;
                        
                    }
                    else{
                        if(!next){
                            coef={
                                ...coef,
                                [`a${i+1}${j+1}`]:"0"
                                
                            }
                        }
                        else{
                            next=false;
                        }
                    }
                    if(j===limit-1) iterator++;
                }
                if(coef[`l${i+1}`]==="<="){
                    if(i+iterator===j-props.numVar){
                        basics++;
                        coef={
                            ...coef,
                            [`a${i+1}${j+1}`]:"1",
                            [`vb${basics}`]:`x${j+1}`
                        };
                    }
                    else{
                        coef={
                            ...coef,
                            [`a${i+1}${j+1}`]:"0",
                           
                        }
                    }
                }
                if(coef[`l${i+1}`]==="="){
                    if(i+iterator===j-props.numVar){
                        basics++;
                        coef={
                            ...coef,
                            [`a${i+1}${j+1}`]:"1",
                            [`vb${basics}`]:`x${j+1}`,
                            [`c${j+1}`]:"100"
                        };
                        varArtificial.push(basics);
                    }
                    else{
                        coef={
                            ...coef,
                            [`a${i+1}${j+1}`]:"0",
                            
                        }
                    }
                }
                
            }
        }
        console.log(varNoBasic);
        return res={
            coef,
            varArtificial,
            varNoBasic
        }
    }
    const generateFaseCoef=(coefActual,count,signo)=>{
        let coef=coefActual
        const limit=count+parseInt(props.numVar);
        for(let i=0;i<=limit;i++){
            if(i===0){
                coef={
                    ...coef,
                    b0:0
                }
            }
            else{
                coef={
                    ...coef,
                    [`vnb${i}`]:`x${i}`
                }
                if(i<=props.numVar){
                    coef={
                        ...coef,
                        [`c${i}`]:-1*parseFloat(coef[`c${i}`])*signo
                    }
                }

            }
        }
        return coef;
    }
    const prepareToIteration=(coefActual,count,varArtificial,signo)=>{
        let coef=coefActual,
        limit=count+parseInt(props.numVar);
        varArtificial.forEach((el)=>{
            for(let i=0;i<=limit;i++){
                console.log(el,"DENTRO DEL FOREACH")
                if(i===0){
                    coef={
                        ...coef,
                        b0:signo*100*parseFloat(coef[`b${el}`])+parseFloat(coef.b0)
                    }
                    console.log(parseFloat(coef.b0),"B0",parseFloat(coef[`b${el}`]))
                }
                else{

                    coef={
                        ...coef,
                        [`c${i}`]:signo*100*parseFloat(coef[`a${el}${i}`])+parseFloat(coef[`c${i}`])
                    }
                }
            }
        });
        return coef;
    }
    const mostrarResultado=(coef,isM)=>{
        let h3;
        console.log(isM,"ESTADO M");
        console.log("NUEVA FUNCION IMPLEMENTADA");
        if(isM){
            for(let i=0;i<props.numRest;i++){
                console.log("DENTRO DE LAS VB")
                h3=<>{h3}<h3>{coef[`vb${i+1}`]}={coef[`b${i+1}`]}</h3></>
            }
        }
        else{
            if(props.caso==="Min"){
                console.log("DENTRO DE LAS X1=0")
                for(let j=0;j<props.numVar;j++){
                    h3=<>{h3}<h3>{`x${j+1}`}=0</h3></>
                }
            }
        }
        return h3;
    }
        
        let coefActual=handleNegative(),
         response,
         signo=-1,
         signoCoef=1,
        resp=verifyRest(coefActual);
        if(resp.isFase){
            (props.caso==="Min")?signoCoef=-1:signoCoef=1;
             response=generateModel(coefActual,resp.count);
            coefActual=generateFaseCoef(response.coef,resp.count,signoCoef);
           coefActual=prepareToIteration(coefActual,resp.count,response.varArtificial,signo);
           console.log(response.varNoBasic);
           coefActual=metodoSimplex(coefActual,resp.count,response.varNoBasic);

        }
        else{
        let res =preGenerateCoefGain(coefActual);
        coefActual=generatePadron(res.coefCopy);
            coefActual=metodoSimplex(coefActual,props.numRest,res.varNb);
        };
        let h3=mostrarResultado(coefActual,resp.isFase);
        setRespuesta(h3);
        setCoef(coefActual);
        setAceptar(true);
    },[]);
    
    
    return(
    <>
        {aceptar && cuadros }
        <h3>La solución es: Z={(props.caso==="Min")?-1*coef.b0:coef.b0} para</h3> 
        {aceptar && respuesta}
    </>
    )
}