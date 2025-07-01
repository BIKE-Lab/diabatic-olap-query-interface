import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Hierarchy from "./Hierarchy";
import { useDispatch, useSelector } from "react-redux";
import { add_to_prefix_list } from "@/lib/redux/action";
import { splitIRI } from "@/lib/custom/helper"

export default function Dimension({info}) {
    
    const dispatch = useDispatch()

    const [hierarchyShow, setHierarchyShow] = useState(false)
    const [dimensionName, setDimensionName] = useState('')

    
    const prefixes = useSelector((state) => state.datasetReducer.prefixes);

    const update_Dimension_name_prefix = ()=>{
        const splittedName = splitIRI(info.name)
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
        var tempID = ''
        if(splittedName[0] in tempPrefixes !== true){

            tempPrefixes[splittedName[0]] =  "prefix"+tempID;
            tempPrefixes["prefix"+tempID] =  splittedName[0];
            
            setDimensionName("prefix"+tempID+":"+splittedName[1]);
            if(tempID === '') tempID = 1;
            else tempID++;
        }
        else{
            setDimensionName(tempPrefixes[splittedName[0]]+":"+splittedName[1]);
        }
        dispatch(add_to_prefix_list(tempPrefixes))
    }

    useEffect(() => {
      if(info && info.name.length>0) update_Dimension_name_prefix()
    }, [info])
    

    return (
        <Box sx={{borderColor:'gray',borderLeftWidth:'2px'}}>
            <Box onClick={()=>setHierarchyShow(!hierarchyShow)}className="flex flex-wrap justify-between cursor-pointer">
                <Box className='w-11/12'>__   
                    {dimensionName}
                </Box>
                <Box  className='w-1/12 text-center'>
                   <KeyboardArrowDownIcon/>
                </Box>
            </Box>
            <Box sx={{paddingLeft:'15px'}} hidden={!hierarchyShow}>
                {
                    info && info.name.length>0 && info.hierarchies.map(h=>(
                        <Hierarchy key={h.name} info={h}/>
                    ))
                    
                }
            </Box>
        </Box>
        
    )
}

const leftLine = {
    position:'absolute',
    backgroundColor:'gray',
    height:'2px',
    width:'5%',
    top:'40%',
    left:'0%'
}