import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Level from "./Level";
import { useDispatch, useSelector } from "react-redux";
import { add_to_prefix_list } from "@/lib/redux/action";
import { splitIRI } from "@/lib/custom/helper"


export default function Hierarchy({info}) {
    
    const dispatch = useDispatch()

    const [levelShow, setLevelShow] = useState(false)
    const [hierarchyName, setHierarchyName] = useState('')

    const prefixes = useSelector((state) => state.datasetReducer.prefixes);

    const update_hierarchy_name_prefix = ()=>{
        const splittedName = splitIRI(info.name)
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
        var tempID = ''
        if(splittedName[0] in tempPrefixes !== true){

            tempPrefixes[splittedName[0]] =  "prefix"+tempID;
            tempPrefixes["prefix"+tempID] =  splittedName[0];
            
            setHierarchyName("prefix"+tempID+":"+splittedName[1]);
            if(tempID === '') tempID = 1;
            else tempID++;
        }
        else{
            setHierarchyName(tempPrefixes[splittedName[0]]+":"+splittedName[1]);
        }
        dispatch(add_to_prefix_list(tempPrefixes))
    }

    useEffect(() => {
        if(info && info.name.length>0) update_hierarchy_name_prefix()
      }, [info])

    return (
        <Box sx={{borderColor:'gray'}}>
           <Box onClick={()=>setLevelShow(!levelShow)} className="flex flex-wrap justify-between cursor-pointer">
                <Box className='w-11/12 relative' sx={{borderColor:'gray',borderLeftWidth:'2px'}}>
                    <span style={leftLine}></span>
                    {/* <span style={leftCircle}></span> */}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {hierarchyName}
                </Box>
                <Box  className='w-1/12 text-center'>
                   <KeyboardArrowDownIcon/>
                </Box>
            </Box>
            <Box sx={{borderColor:'gray',borderLeftWidth:'2px',paddingLeft:'15px'}} hidden={!levelShow}>
                {
                    info && info.name.length>0 && info.levels.map(l=>(
                        <Level key={l.name} info={l} rollupSerial={info.rollUpSerial}/>
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

const leftCircle = {
    position:'absolute',
    backgroundColor:'gray',
    height:'7px',
    width:'7px',
    borderRadius:'50%',
    top:'30%',
    left:'-17.5%'
}