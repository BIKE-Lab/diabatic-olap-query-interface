import { add_to_all_level_data, add_to_prefix_list, try_to_add_level, update_selected_level_data } from "@/lib/redux/action";
import Box from "@mui/material/Box"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { splitIRI } from "@/lib/custom/helper"


export default function Level({info,rollupSerial}) {

    const dispatch = useDispatch()

    const [levelName, setLevelName] = useState('')

    const prefixes = useSelector((state) => state.datasetReducer.prefixes);
    const tbox = useSelector((state) => state.datasetReducer.tbox);
    const abox = useSelector((state) => state.datasetReducer.abox);
    const selectedLevelData = useSelector((state)=> state.datasetReducer.selectedLevelData)
    const allLevelData = useSelector((state)=> state.datasetReducer.allLevelData)

    const update_level_name_prefix = ()=>{
        const splittedName = splitIRI(info.name)
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
        var tempID = ''
        if(splittedName[0] in tempPrefixes !== true){

            tempPrefixes[splittedName[0]] =  "prefix"+tempID;
            tempPrefixes["prefix"+tempID] =  splittedName[0];
            
            setLevelName("prefix"+tempID+":"+splittedName[1]);
            if(tempID === '') tempID = 1;
            else tempID++;
        }
        else{
            setLevelName(tempPrefixes[splittedName[0]]+":"+splittedName[1]);
        }
        dispatch(add_to_prefix_list(tempPrefixes))
    }

    const selectThisLevel =  async ()=>{
        if(selectedLevelData && selectedLevelData[info.name]){
            dispatch(update_selected_level_data(allLevelData[info.name]))
        }
        const res = await fetch('/api/get_level_attribute_instance', {
            method: "POST",
            body:JSON.stringify({tbox:tbox,abox:abox,level:info.name})}
        )
        if(res){
            const data = await res.json()
            dispatch(update_selected_level_data(data.levelData))
            dispatch(add_to_all_level_data(info.name, data.levelData))
        }
        else{
            console.log("couldn't fetch the tree structure...")
        }
        dispatch(try_to_add_level({levelName:info.name, prefixName:levelName,inDimension:info.inDimension,inHierarchy:info.inHierarchy, rollupSerial}))
    }

    useEffect(() => {
        if(info && info.name.length>0) update_level_name_prefix()
    }, [info])
    

    return (
        <Box onClick={()=>{selectThisLevel()}}>
            <Box className="flex flex-wrap justify-between cursor-pointer">
                <Box  className='w-full relative' sx={{borderColor:'gray',borderLeftWidth:'2px'}}>
                    <span style={leftLine}></span>
                    {/* <span style={leftCircle}></span> */}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {levelName}
                </Box>
            </Box>
        </Box>
    )
}

const leftLine = {
    position:'absolute',
    backgroundColor:'gray',
    height:'2px',
    width:'5%',
    top:'45%',
    left:'0%'
}

const leftCircle = {
    position:'absolute',
    backgroundColor:'gray',
    height:'7px',
    width:'7px',
    borderRadius:'50%',
    top:'28%',
    left:'-24%'
}