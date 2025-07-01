import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from "react-redux";
import { add_to_prefix_list } from "@/lib/redux/action";
import AggFunction from "./AggFunction";
import { splitIRI } from "@/lib/custom/helper"

export default function Measure({info}) {
    const dispatch = useDispatch()

    const [aggFuncShow, setAggFuncShow] = useState(false)
    const [measureName, setMeasureName] = useState('')
    const [rangeName, setRangeName] = useState('')

    
    const prefixes = useSelector((state) => state.datasetReducer.prefixes);

    const getPrefixName = (rangeName) => {
        const splittedName = splitIRI(rangeName)
        const prefixKey = splittedName[0];
    
        let prefixName;
        
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))

        if (prefixKey === 'http://www.w3.org/2001/XMLSchema') {
            return 'xsd';
        } else if (prefixKey in tempPrefixes) {
            prefixName = prefixes[prefixKey];
        } else {
            let tempID = (Object.keys(tempPrefixes).length)/2 + 1;
            tempPrefixes[prefixKey] = "range" + tempID;
            tempPrefixes["range" + tempID] = prefixKey;
            prefixName = "range" + tempID;
        }
    
        dispatch(add_to_prefix_list(tempPrefixes))
        return prefixName;
    };

    const update_measure_name_prefix = ()=>{
        const splittedName = splitIRI(info.measureName)
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
        var tempID = ''
        if(splittedName[0] in tempPrefixes !== true){

            tempPrefixes[splittedName[0]] =  "prefix"+tempID;
            tempPrefixes["prefix"+tempID] =  splittedName[0];
            
            setMeasureName("prefix"+tempID+":"+splittedName[1]);
            if(tempID === '') tempID = (Object.keys(prefixes).length)/2;
            else tempID++;
        }
        else{
            setMeasureName(tempPrefixes[splittedName[0]]+":"+splittedName[1]);
        }
        dispatch(add_to_prefix_list(tempPrefixes))
    }

    useEffect(() => {
      if(info && info.measureName.length>0) {
        update_measure_name_prefix()
        setRangeName(getPrefixName(info.range.rangeName)+':'+info.range.rangeValue)
    }
    }, [info])
    

  return (
        <Box sx={{borderColor:'gray',borderLeftWidth:'2px'}}>
            <Box onClick={()=>setAggFuncShow(!aggFuncShow)} sx={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',cursor:'pointer'}}>
                <Box className='w-11/12'>__    
                    {measureName}
                </Box>
                <Box className='w-1/12 text-center'>
                   <KeyboardArrowDownIcon/>
                </Box>
            </Box>
            <Box sx={{paddingLeft:'15px'}} hidden={!aggFuncShow}>
                <small className="block my-0 py-0">{rangeName}</small>
                <small className="block my-0 py-0">Aggregate Functions</small>
                {
                    info && info.measureName.length>0 && info.aggFunctions.map(A=>(
                        <AggFunction key={A.aggFuncName} measureInfo={{"measureName": info.measureName,"measurePrefixName":measureName, "range":info.range.rangeName}} info={A}/>
                    ))
                    
                }
            </Box>
        </Box>
  )
}


